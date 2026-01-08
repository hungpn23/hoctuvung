import * as fs from "node:fs";
import * as path from "node:path";
import {
	type IntegrationConfig,
	integrationConfig,
} from "@config/integration.config";
import { type VectorDbConfig, vectorDbConfig } from "@config/vector-db.config";
import { CohereEmbeddings } from "@langchain/cohere";
import { Document } from "@langchain/core/documents";
import { QdrantVectorStore } from "@langchain/qdrant";
import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
} from "@nestjs/common";
import StreamArray from "stream-json/streamers/StreamArray";
import { EntryRecord } from "./suggestion.type";

@Injectable()
export class SuggestionService {
	private readonly logger = new Logger(SuggestionService.name);
	private readonly model: CohereEmbeddings;
	private _store?: QdrantVectorStore;

	constructor(
		@Inject(integrationConfig.KEY)
		private readonly integrationConf: IntegrationConfig,
		@Inject(vectorDbConfig.KEY)
		private readonly vectorDbConf: VectorDbConfig,
	) {
		this.model = new CohereEmbeddings({
			model: "embed-multilingual-v3.0",
			apiKey: this.integrationConf.cohereApiKey,
		});
	}

	get store() {
		if (!this._store)
			throw new BadRequestException(
				"VectorStore is not initialized. Call init() first.",
			);

		return this._store;
	}

	async connectToStore() {
		const { host, port, collectionName } = this.vectorDbConf;

		this._store = await QdrantVectorStore.fromExistingCollection(this.model, {
			url: `http://${host}:${port}`,
			collectionName,
		});

		this.logger.debug("Connected to VectorStore.");
	}

	async ingestData() {
		const filePath = path.join(process.cwd(), "data.json");
		const stream = fs.createReadStream(filePath);
		const jsonStream = StreamArray.withParser();
		let batch: EntryRecord[] = [];
		const BATCH_SIZE = 1000;
		let count = 0;

		return new Promise<void>((resolve, reject) => {
			stream.pipe(jsonStream);

			jsonStream.on("data", async ({ value }: { value: EntryRecord }) => {
				batch.push(value);
				if (batch.length >= BATCH_SIZE) {
					// Pause to handle async ingestion
					stream.pause();
					jsonStream.pause();

					try {
						const documents = batch.map((d) => this._buildDocument(d));
						await this.store.addDocuments(documents);
						count += batch.length;
						this.logger.debug(`Ingested ${count} documents...`);
						batch = [];
					} catch (err) {
						this.logger.error("Error ingesting batch", err);
						reject(err);
						return;
					}

					jsonStream.resume();
					stream.resume();
				}
			});

			jsonStream.on("end", async () => {
				if (batch.length > 0) {
					try {
						const documents = batch.map((d) => this._buildDocument(d));
						await this.store.addDocuments(documents);
						count += batch.length;
						this.logger.debug(`Ingested ${count} documents.`);
					} catch (err) {
						this.logger.error("Error ingesting final batch", err);
						reject(err);
						return;
					}
				}
				this.logger.debug("Data ingestion completed.");
				resolve();
			});

			jsonStream.on("error", (err) => {
				this.logger.error("Stream error", err);
				reject(err);
			});
		});
	}

	async suggest(query: string, k: number = 1) {
		return await this.store.similaritySearch(query, k);
	}

	private _buildDocument(record: EntryRecord) {
		const {
			term,
			termLanguageCode,
			definitionEn,
			definitionVi,
			exampleEn,
			pos,
		} = record;

		const parts: string[] = [];

		parts.push(`Term (${termLanguageCode}): ${term}.`);
		parts.push(`Definition (English): ${definitionEn}.`);
		parts.push(`Definition (Vietnamese): ${definitionVi}.`);
		parts.push(`Example (English): ${exampleEn}.`);
		if (pos) parts.push(`Part of Speech: ${pos}.`);

		return new Document({
			pageContent: parts.join("\n"),
			metadata: record,
		});
	}
}

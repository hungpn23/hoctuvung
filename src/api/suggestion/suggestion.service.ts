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
import { EntryRecord } from "./suggestion.type";

const sampleData: EntryRecord[] = [
	{
		id: "bank_word_1",
		type: "word",
		term: "bank",
		termLanguageCode: "en",
		definitionEn:
			"A financial institution that accepts deposits and provides loans.",
		definitionVi:
			"Ngân hàng là tổ chức tài chính nhận tiền gửi và cung cấp các khoản vay.",
		exampleEn: "I deposited some money in the bank.",
		pos: "noun",
		senseId: "financial_institution",
		collocation: "bank account",
	},
	{
		id: "be_willing_to_phrase_1",
		type: "phrase",
		term: "be willing to",
		termLanguageCode: "en",
		definitionEn:
			"To be ready or prepared to do something, showing a positive attitude or intention.",
		definitionVi:
			"Sẵn sàng làm điều gì đó, thể hiện thái độ hoặc ý định tích cực.",
		exampleEn: "She is willing to help her teammates.",
		usageOrGrammar: "be willing to + verb",
	},
	{
		id: "break_the_ice_idiom_1",
		type: "phrase",
		term: "break the ice",
		termLanguageCode: "en",
		definitionEn:
			"To do or say something that makes people feel more relaxed in a social situation.",
		definitionVi:
			"Phá vỡ sự ngượng ngùng hoặc căng thẳng ban đầu trong giao tiếp.",
		exampleEn: "He told a joke to break the ice at the meeting.",
		usageOrGrammar: "Often used in social situations or first meetings.",
	},
];

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
		const documents = sampleData.map((d) => this._buildDocument(d));

		await this.store.addDocuments(documents);

		this.logger.debug("Data ingestion completed.");
	}

	async suggest(query: string, k: number = 1) {
		return await this.store.similaritySearch(query, k);
	}

	private _buildDocument(record: EntryRecord) {
		const { term, termLanguageCode, definitionEn, definitionVi, exampleEn } =
			record;

		const parts: string[] = [];

		parts.push(`Term (${termLanguageCode}): ${term}.`);
		parts.push(`Definition (English): ${definitionEn}`);
		parts.push(`Definition (Vietnamese): ${definitionVi}`);
		parts.push(`Example (English): ${exampleEn}`);

		return new Document({
			pageContent: parts.join("\n\t"),
			metadata: record,
		});
	}
}

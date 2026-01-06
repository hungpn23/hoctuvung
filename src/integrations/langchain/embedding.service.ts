import { CohereEmbeddings } from "@langchain/cohere";
import { Injectable } from "@nestjs/common";
import "dotenv/config";

@Injectable()
export class EmbeddingService {
	private readonly model: CohereEmbeddings;

	constructor() {
		this.model = new CohereEmbeddings({
			model: "embed-multilingual-v3.0",
			apiKey: process.env.COHERE_API_KEY,
		});
	}

	get instance() {
		return this.model;
	}
}

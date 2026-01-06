import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { Injectable, Logger } from "@nestjs/common";
import { EmbeddingService } from "./embedding.service";
import { EntryRecord } from "./types";

const sampleData: EntryRecord[] = [
	{
		id: "bank_word_1",
		type: "word",
		term: "bank",
		termLang: "english",
		definitionEnglish:
			"A financial institution that accepts deposits and provides loans.",
		definitionVietnamese:
			"Ngân hàng là tổ chức tài chính nhận tiền gửi và cung cấp các khoản vay.",
		pos: "noun",
		senseId: "financial_institution",
		exampleEnglish: "I deposited some money in the bank.",
		source: "manual",
	},
	{
		id: "be_willing_to_phrase_1",
		type: "phrase",
		term: "be willing to",
		termLang: "english",
		definitionEnglish:
			"To be ready or prepared to do something, showing a positive attitude or intention.",
		definitionVietnamese:
			"Sẵn sàng làm điều gì đó, thể hiện thái độ hoặc ý định tích cực.",
		grammar: "be willing to + verb",
		exampleEnglish: "She is willing to help her teammates.",
		source: "manual",
	},
	{
		id: "break_the_ice_idiom_1",
		type: "phrase",
		term: "break the ice",
		termLang: "english",
		definitionEnglish:
			"To do or say something that makes people feel more relaxed in a social situation.",
		definitionVietnamese:
			"Phá vỡ sự ngượng ngùng hoặc căng thẳng ban đầu trong giao tiếp.",
		usage: "Often used in social situations or first meetings.",
		exampleEnglish: "He told a joke to break the ice at the meeting.",
		source: "manual",
	},
];

@Injectable()
export class StoreService {
	private readonly logger = new Logger(StoreService.name);
	private readonly store: MemoryVectorStore;

	constructor(private readonly embeddingService: EmbeddingService) {
		this.store = new MemoryVectorStore(this.embeddingService.instance);
	}

	async similaritySearch(query: string, k = 2) {
		return await this.store.similaritySearch(query, k);
	}

	async ingestData(_records?: EntryRecord[]) {
		const documents = sampleData.map((record) =>
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			this._buildDocument(record),
		) as Document[];

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		await this.store.addDocuments(documents);

		this.logger.log("Data ingestion completed.");
	}

	private _buildPageContent(record: EntryRecord): string {
		const parts: string[] = [];

		parts.push(`Term (${record.termLang}): ${record.term}`);
		parts.push(`Definition (English): ${record.definitionEnglish}`);
		parts.push(`Definition (Vietnamese): ${record.definitionVietnamese}`);
		parts.push(`Example (English): ${record.exampleEnglish}`);

		return parts.join("\n\n");
	}

	private _buildDocument(record: EntryRecord) {
		const metadata: Record<string, string> = {
			type: record.type,
		};
		if (record.type === "word") {
			metadata.pos = record.pos;
			metadata.senseId = record.senseId;
		} else if (record.type === "phrase") {
			metadata.grammar = record.grammar || "";
			metadata.usage = record.usage || "";
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
		return new Document({
			pageContent: this._buildPageContent(record),
			metadata,
		});
	}
}

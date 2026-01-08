import { LanguageCode } from "@common/types";

export type EntryType = "word" | "phrase";

export type VocabularyRecord = {
	id: string;
	type: EntryType;
	term: string;
	termLanguageCode: LanguageCode;
	definitionEn: string;
	definitionVi: string;
	exampleEn: string;
	pos?: string;
};

export type WordRecord = VocabularyRecord & {
	type: "word";
	pronunciation: string;
};

export type PhraseRecord = VocabularyRecord & {
	type: "phrase";
	usageOrGrammar: string;
};

export type EntryRecord = WordRecord | PhraseRecord;

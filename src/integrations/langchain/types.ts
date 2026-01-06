export type EntryType = 'word' | 'phrase';

export type SourceType = 'manual';

export type VocabularyRecord = {
  id: string;
  type: EntryType;
  term: string;
  termLang: string;
  definitionEnglish: string;
  definitionVietnamese: string;
  exampleEnglish: string;
  source?: SourceType;
};

export type WordRecord = VocabularyRecord & {
  type: 'word';
  pos: string;
  senseId: string;
};

export type PhraseRecord = VocabularyRecord & {
  type: 'phrase';
  grammar?: string;
  usage?: string;
};

export type EntryRecord = WordRecord | PhraseRecord;

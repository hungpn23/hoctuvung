import { UUID } from "./branded.type";

export type ImageUploadData = {
	userId: UUID;
	filePath: string;
	fileName: string;
};

export type UpdateUserStatsData = {
	userId: UUID;
	learnedCount: number;
};

import { UUID } from '@common/types/branded.type';

export type UpdateUserStatsData = {
  userId: UUID;
  cardsLearnedCount: number;
};

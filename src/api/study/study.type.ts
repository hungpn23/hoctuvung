import { Card } from '@api/deck/entities/card.entity';
import type { UUID } from '@common/types/branded.type';

export type StudySessionState = {
  deckId: UUID;
  reviewPile: Card[]; // Thẻ đang chờ học
  failedPile: Card[]; // Thẻ đã trả lời sai
  totalCount: number; // Tổng số thẻ ban đầu
};

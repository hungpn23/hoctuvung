export interface ICrudApplication<T, TKey = number> {
  GetAllAsync(): Promise<T[]>;
  GetAsync(id: TKey): Promise<T | null>;
  CreateAsync(entity: T): Promise<T>;
  UpdateAsync(id: TKey, entity: Partial<T>): Promise<T>;
  DeleteAsync(id: TKey): Promise<void>;
}

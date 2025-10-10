import { Order } from '@common/constants/order.enum';
import {
  NumberValidatorOptional,
  OptionalStringValidator,
} from '@common/decorators/validators.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class QueryDto {
  @Expose()
  @ApiPropertyOptional({ minimum: 1 })
  @NumberValidatorOptional({ isInt: true, minimum: 1 })
  page: number = 1;

  @Expose()
  @ApiPropertyOptional({ minimum: 10 })
  @NumberValidatorOptional({ isInt: true, minimum: 10 })
  take: number = 10;

  @Expose()
  @ApiPropertyOptional({ type: () => Order, default: Order.DESC })
  @OptionalStringValidator()
  order: Order = Order.DESC;

  @Expose()
  @ApiPropertyOptional()
  @OptionalStringValidator()
  search?: string;

  get skip() {
    return this.page ? (this.page - 1) * this.take : 0;
  }
}

@Exclude()
export class MetadataDto {
  @Expose()
  @ApiProperty()
  take: number;

  @Expose()
  @ApiProperty()
  totalRecords: number;

  @Expose()
  @ApiProperty()
  totalPages: number;

  @Expose()
  @ApiProperty()
  currentPage: number;

  @Expose()
  @ApiPropertyOptional()
  nextPage?: number;

  @Expose()
  @ApiPropertyOptional()
  previousPage?: number;
}

@Exclude()
export class PaginatedDto<T> {
  @Expose()
  @ApiProperty({ type: Array<T> })
  data: T[];

  @Expose()
  @ApiProperty({ type: MetadataDto })
  metadata: MetadataDto;
}

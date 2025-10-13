import { Order } from '@common/constants/order.enum';
import {
  EnumValidatorOptional,
  NumberValidatorOptional,
  StringValidatorOptional,
} from '@common/decorators/validators.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class QueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @NumberValidatorOptional({ isInt: true, minimum: 1 })
  page: number = 1;

  @ApiPropertyOptional({ minimum: 10, default: 10 })
  @NumberValidatorOptional({ isInt: true, minimum: 10 })
  limit: number = 10;

  @ApiPropertyOptional({
    enum: Order,
    enumName: 'Order',
    default: Order.DESC,
  })
  @EnumValidatorOptional(Order)
  order: Order = Order.DESC;

  @ApiPropertyOptional()
  @StringValidatorOptional()
  q?: string;

  get offset() {
    return this.page ? (this.page - 1) * this.limit : 0;
  }
}

@Exclude()
export class MetadataDto {
  @Expose()
  @ApiProperty()
  limit!: number;

  @Expose()
  @ApiProperty()
  totalRecords!: number;

  @Expose()
  @ApiProperty()
  totalPages!: number;

  @Expose()
  @ApiProperty()
  currentPage!: number;

  @Expose()
  @ApiPropertyOptional()
  nextPage?: number;

  @Expose()
  @ApiPropertyOptional()
  previousPage?: number;
}

@Exclude()
export class PaginatedDto<T> {
  // manually define swagger schema model at ApiPaginatedResponse decorator
  @ApiProperty({ type: Array<object> }) // just for swagger ui purpose
  @Expose()
  data!: T[];

  @Expose()
  @ApiProperty({ type: MetadataDto })
  metadata!: MetadataDto;
}

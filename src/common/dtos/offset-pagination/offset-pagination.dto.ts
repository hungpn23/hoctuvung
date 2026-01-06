import {
	EnumValidatorOptional,
	NumberValidatorOptional,
	StringValidatorOptional,
} from "@common/decorators/validators.decorator";
import { QueryOrder } from "@mikro-orm/core";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class QueryDto {
	@ApiPropertyOptional({ minimum: 1, default: 1 })
	@NumberValidatorOptional({ isInt: true, minimum: 1 })
	page: number = 1;

	@ApiPropertyOptional({ minimum: 10, default: 10 })
	@NumberValidatorOptional({ isInt: true, minimum: 10 })
	limit: number = 10;

	@ApiPropertyOptional({
		enum: QueryOrder,
		default: QueryOrder.DESC_NULLS_LAST,
	})
	@EnumValidatorOptional(QueryOrder)
	order: QueryOrder = QueryOrder.DESC_NULLS_LAST;

	@ApiPropertyOptional()
	@StringValidatorOptional()
	search?: string | null;

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
	nextPage?: number | null;

	@Expose()
	@ApiPropertyOptional()
	previousPage?: number | null;
}

@Exclude()
export class PaginatedDto<T> {
	// manually define swagger schema model at ApiPaginatedResponse decorator
	@ApiProperty({ type: [Object] }) // just for swagger ui purpose
	@Expose()
	data!: T[];

	@Expose()
	@ApiProperty({ type: MetadataDto })
	metadata!: MetadataDto;
}

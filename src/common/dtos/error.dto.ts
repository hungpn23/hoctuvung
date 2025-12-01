import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ErrorDto {
  @Expose()
  @ApiProperty()
  timestamp!: string;

  @Expose()
  @ApiProperty()
  statusCode!: number;

  @Expose()
  @ApiProperty()
  message!: string;

  @Expose()
  @ApiPropertyOptional({ type: () => [ErrorDetailDto] })
  details?: ErrorDetailDto[] | null;
}

@Exclude()
export class ErrorDetailDto {
  @Expose()
  @ApiProperty()
  property!: string;

  @Expose()
  @ApiProperty()
  constraintName!: string;

  @Expose()
  @ApiProperty()
  message!: string;
}

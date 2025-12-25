import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

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

@Exclude()
export class ErrorDto {
  @Expose()
  @ApiProperty()
  timestamp!: string;

  @Expose()
  @ApiProperty()
  statusCode!: number;

  @Expose()
  @ApiPropertyOptional()
  statusMessage?: string;

  @Expose()
  @ApiProperty()
  message!: string;

  @Expose()
  @ApiPropertyOptional({ type: [ErrorDetailDto] })
  details?: ErrorDetailDto[] | null;
}

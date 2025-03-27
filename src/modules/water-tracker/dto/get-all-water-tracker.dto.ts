import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, IsTimeZone, Min } from 'class-validator';

export class GetAllWaterTrackerDto {
  @ApiProperty({
    description: 'Número de página que se desea obtener',
    example: 2,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({
    description: 'Número máximo de elementos por página',
    example: 15,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;
}

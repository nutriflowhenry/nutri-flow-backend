import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsTimeZone, Matches } from 'class-validator';

export class GetDailyWaterTrackerDto {
  @ApiProperty({
    description: 'Zona horaria del usuario',
    example: 'America/Mexico_City',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsTimeZone()
  timeZone?: string;

  @ApiProperty({
    description: 'Fecha en formato YYYY-MM-DD',
    example: '2025-06-08',
    required: false,
    type: String,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'El formato debe ser YYYY-MM-DD'
  })
  date?: string;
}
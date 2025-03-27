import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsTimeZone } from 'class-validator';

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
    description:
      'Fecha de la cual se desea obtener los registros de consumo de agua, debe estar en formato ISO8601',
    example: '2025-02-11',
    required: false,
    type: String,
  })
  @IsISO8601(
    {},
    {
      message:
        'El query param "\date\" debe tener como valor una feche con formato: YYYY-MM-DDTHH:mm:ss.sssZ',
    },
  )
  @IsOptional()
  date?: string;
}

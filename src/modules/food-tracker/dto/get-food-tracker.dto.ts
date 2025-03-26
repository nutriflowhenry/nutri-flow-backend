import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, IsTimeZone, Min } from 'class-validator';

export class GetFoodTrackerDto {
  // Con string tipo YYYY-MM-DD
  //   @IsDateString()
  //   @IsOptional()
  //   date?: string;
  //   @IsOptional()
  //   @IsString()
  //   timeZone?: string;
  // En UTC desde el front
  @ApiProperty({
    description: 'Fecha de creación del registro de comida',
    example: '2023-11-23',
    required: false,
    type: String,
  })
  @IsISO8601(
    {},
    {
      message:
        'El atributo "\date\" debe tener como valor una feche con formato: YYYY-MM-DDTHH:mm:ss.sssZ',
    },
  )
  @IsOptional()
  date?: string;

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

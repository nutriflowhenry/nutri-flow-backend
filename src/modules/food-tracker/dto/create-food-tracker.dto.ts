import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateFoodTrackerDto {
  @ApiProperty({
    description: 'Nombre con el que se desea guardar el registro de la comida',
    example: 'Carne asada',
    required: true,
    type: String,
  })
  @MinLength(3, {
    message: 'El atributo "\name\" debe tener al menos 3 caracteres',
  })
  @MaxLength(50, {
    message: 'El atributo "\name\" no puede tener más de 20 caracteres',
  })
  @IsString({ message: 'El atributo "\name"\ debe ser de tipo string' })
  @IsNotEmpty({
    message: 'Debe existir un atributo "\name\" con el nombre de la comida',
  })
  name: string;

  @ApiProperty({
    description: 'Cantidad de calorías ingeridas',
    example: 10,
    required: true,
    type: Number,
  })
  @IsNumber({}, { message: 'El atributo "\calories\" debe ser un número' })
  @Min(1, {
    message: 'El atributo "\calories\" no puede tener un valor menor a 1',
  })
  calories: number;

  @ApiProperty({
    description: 'Descripción de la comida ingerida',
    example: 'Carne asada a las brasas acompañada de nopales',
    required: true,
    type: String,
  })
  @MaxLength(500, {
    message:
      'El atributo "\description\" no puede tener una longitud mayor de 50 caracteres',
  })
  @IsString({ message: 'El atributo "\description"\ debe ser de tipo string' })
  @IsOptional()
  description: string;

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
        'El atributo "\date\" debe tener como valor una feche con formato: YYYY-MM-DDTHH:mm:ss.sssZ o YYYY-MM-DD',
    },
  )
  @IsOptional()
  createdAt?: string;

  @ApiProperty({
    description:
      'Url de la imagen que se desea asociar con el registro de comida',
    example:
      'https://mi-bucket.s3.us-east-1.amazonaws.com/imagenes/ejemplo.jpg',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  image: string;
}

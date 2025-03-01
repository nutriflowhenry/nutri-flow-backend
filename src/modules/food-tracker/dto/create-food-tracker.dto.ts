import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateFoodTrackerDto {
  @MinLength(3, {
    message: 'El atributo "\name\" debe tener al menos 3 caracteres',
  })
  @MaxLength(20, {
    message: 'El atributo "\name\" no puede tener más de 20 caracteres',
  })
  @IsString({ message: 'El atributo "\name"\ debe ser de tipo string' })
  @IsNotEmpty({
    message: 'Debe existir un atributo "\name\" con el nombre de la comida',
  })
  name: string;

  @IsNumber({}, { message: 'El atributo "\calories\" debe ser un número' })
  @Min(1, {
    message: 'El atributo "\calories\" no puede tener un valor menor a 1',
  })
  calories: number;

  @MaxLength(50, {
    message:
      'El atributo "\description\" no puede tener una longitud mayor de 50 caracteres',
  })
  @IsString({ message: 'El atributo "\description"\ debe ser de tipo string' })
  @IsOptional()
  description: string;
}

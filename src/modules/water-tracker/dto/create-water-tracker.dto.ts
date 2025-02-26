import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateWaterTrackerDto {
  @IsNotEmpty({ message: 'Se necesita una cantidad de agua consumida' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  amount: number;

  // user: string; // Sólo mientras se cree el guard que añada el user a la request.
}

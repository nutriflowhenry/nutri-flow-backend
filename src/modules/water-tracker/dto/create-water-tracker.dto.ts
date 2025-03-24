import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { UserProfile } from 'src/modules/user-profiles/entities/user-profile.entity';

export class CreateWaterTrackerDto {
  @IsNotEmpty({ message: 'Se necesita una cantidad de agua consumida' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  amount: number;

  @IsNotEmpty()
  @IsDateString(
    {},
    { message: 'El parámetro "date" debe tener el formato ISO (YYYY-MM-DD).' },
  )
  date: string;

  userProfile: UserProfile;
}

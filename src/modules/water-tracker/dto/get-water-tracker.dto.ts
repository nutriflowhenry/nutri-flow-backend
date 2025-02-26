import { IsDateString, IsOptional } from 'class-validator';

export class GetWaterTrackerDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'El parámetro "date" debe tener el formato ISO (YYYY-MM-DD).' },
  )
  date: string;
}

import { IsISO8601, IsOptional } from 'class-validator';

export class CreateDailyFoodTrackerDto {
  @IsISO8601(
    {},
    {
      message:
        'El atributo "\date\" debe tener como valor una feche con formato: YYYY-MM-DDTHH:mm:ss.sssZ o YYYY-MM-DD',
    },
  )
  @IsOptional()
  date?: string;
}

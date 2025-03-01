import { IsISO8601, IsOptional } from 'class-validator';

export class GetFoodTrackerDto {
  // Con string tipo YYYY-MM-DD
  //   @IsDateString()
  //   @IsOptional()
  //   date?: string;
  //   @IsOptional()
  //   @IsString()
  //   timeZone?: string;
  // En UTC desde el front
  @IsISO8601(
    {},
    {
      message:
        'El atributo "\date\" debe tener como valor una feche con formato: YYYY-MM-DDTHH:mm:ss.sssZ',
    },
  )
  @IsOptional()
  // @Type(() => Date)
  date?: string;
}

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
  @IsISO8601(
    {},
    {
      message:
        'El atributo "\date\" debe tener como valor una feche con formato: YYYY-MM-DDTHH:mm:ss.sssZ',
    },
  )
  @IsOptional()
  date?: string;

  @IsOptional()
  @IsTimeZone()
  timeZone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;
}

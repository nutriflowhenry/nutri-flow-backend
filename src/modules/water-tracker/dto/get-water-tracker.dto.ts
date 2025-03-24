import {
  IsDateString,
  IsISO8601,
  IsOptional,
  IsTimeZone,
} from 'class-validator';

export class GetWaterTrackerDto {
  @IsISO8601(
    {},
    {
      message:
        'El query param "\date\" debe tener como valor una feche con formato: YYYY-MM-DDTHH:mm:ss.sssZ',
    },
  )
  @IsOptional()
  date?: string;

  @IsOptional()
  @IsTimeZone()
  timeZone?: string;
}

import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, IsTimeZone, Min } from 'class-validator';
import { GetAllWaterTrackerDto } from './get-all-water-tracker.dto';

export class GetDailyWaterTrackerDto extends PickType(GetAllWaterTrackerDto, [
  'date',
  'timeZone',
] as const) {}

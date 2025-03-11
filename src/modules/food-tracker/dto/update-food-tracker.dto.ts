import { PartialType } from '@nestjs/swagger';
import { CreateFoodTrackerDto } from './create-food-tracker.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateFoodTrackerDto extends PartialType(CreateFoodTrackerDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

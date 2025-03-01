import { PartialType } from '@nestjs/swagger';
import { CreateFoodTrackerDto } from './create-food-tracker.dto';

export class UpdateFoodTrackerDto extends PartialType(CreateFoodTrackerDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateWaterTrackerDto } from './create-water-tracker.dto';

export class UpdateWaterTrackerDto extends PartialType(CreateWaterTrackerDto) {}

import { IsEnum, IsNotEmpty } from 'class-validator';
import { WaterTrackerAction } from '../enums/WaterTrackerAction.enum';

export class UpdateWaterTrackerDto {
  @IsNotEmpty({
    message: 'Se necesita una \"action\", ya sea \"increment\" o \"decrement\"',
  })
  @IsEnum(WaterTrackerAction, {
    message: 'La \"action\" solo puede ser \"increment\" o \"decrement\"',
  })
  action: WaterTrackerAction;
}

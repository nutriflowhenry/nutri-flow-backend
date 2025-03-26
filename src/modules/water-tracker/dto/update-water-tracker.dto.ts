import { IsEnum, IsNotEmpty } from 'class-validator';
import { WaterTrackerAction } from '../enums/WaterTrackerAction.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWaterTrackerDto {
  @ApiProperty({
    description: `Acción a realizar, incrementar o disminuir el registro de agua consumida, valores permitidos : ${Object.values(WaterTrackerAction).join(', ')}`,
    example: WaterTrackerAction.INCREMENT,
    required: true,
    enum: WaterTrackerAction,
    enumName: 'Water Tracker Action',
  })
  @IsNotEmpty({
    message: 'Se necesita una \"action\", ya sea \"increment\" o \"decrement\"',
  })
  @IsEnum(WaterTrackerAction, {
    message: 'La \"action\" solo puede ser \"increment\" o \"decrement\"',
  })
  action: WaterTrackerAction;
}

import { IsEnum, IsNotEmpty, IsInt, Min } from 'class-validator';
import { WaterTrackerAction } from '../enums/WaterTrackerAction.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWaterTrackerDto {
  @ApiProperty({
    description: `Acción a realizar (increment/decrement)`,
    example: WaterTrackerAction.INCREMENT,
    required: true,
    enum: WaterTrackerAction,
  })
  @IsNotEmpty()
  @IsEnum(WaterTrackerAction)
  action: WaterTrackerAction;

  @ApiProperty({
    description: 'Cantidad en mililitros a agregar/quitar',
    example: 250,
    required: true,
    type: Number,
  })

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amount: number;

}
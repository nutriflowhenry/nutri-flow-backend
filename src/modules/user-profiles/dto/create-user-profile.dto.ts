import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { ActivityLevel } from '../enums/activity-level.enum';
import { Goal } from '../enums/goal.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserProfileDto {
  @ApiProperty({
    type: String,
    description: 'Fecha de cumpleaños del usuario, en formato ISO 8601',
    example: '2000-11-12',
    required: true,
  })
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  birthdate: string;

  @ApiProperty({
    description: `Género del usuario, valores permitidos: ${Object.values(Gender).join(', ')}`,
    example: Gender.MALE,
    required: true,
    enum: Gender,
    enumName: 'Género',
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    type: Number,
    description: 'Peso del usuario en kilogramos',
    example: 76.1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(10.0)
  @Max(299.99)
  weight: number;

  @ApiProperty({
    type: Number,
    description: 'Altura del usario en metros',
    example: 1.76,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.5)
  @Max(2.99)
  height: number;

  @ApiProperty({
    description: `Nivel de actividad física del usuario, valores permitidos: ${Object.values(ActivityLevel).join(', ')}`,
    example: ActivityLevel.MODERATE,
    required: true,
    enum: ActivityLevel,
    enumName: 'Nivel de actividad física',
  })
  @IsNotEmpty()
  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel;

  @ApiProperty({
    description: `Objetivo con respecto al peso del usuario, valores permitidos: ${Object.values(Goal).join(', ')}`,
    example: Goal.GAIN_MUSCLE,
    required: true,
    enum: Goal,
    enumName: 'Objetivo con respecto al peso',
  })
  @IsNotEmpty()
  @IsEnum(Goal)
  weightGoal: Goal;
}

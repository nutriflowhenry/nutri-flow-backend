import { Type } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthdate: Date;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(10.0)
  @Max(299.99)
  weight: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.5)
  @Max(2.99)
  height: number;
}

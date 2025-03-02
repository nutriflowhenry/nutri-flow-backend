import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, Length, MaxLength } from 'class-validator';
import { Match } from '../../../decorators/match.decorator';

export class CreateLocalUserDto {
   @IsNotEmpty()
   @IsString()
   @MaxLength(30)
   name: string;

   @IsNotEmpty()
   @IsEmail()
   email: string;

   @IsNotEmpty()
   @IsString()
   @MaxLength(25)
   @IsStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1
   })
   password: string;

   @IsNotEmpty()
   @IsString()
   @Match("password", { message: "Passwords do not match" })
   passwordConfirmation: string;
}

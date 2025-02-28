import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
   @IsEmail({}, { message: 'Please enter a valid email address' })
   @IsNotEmpty({ message: 'Email is required' })
   email: string;

   @IsNotEmpty({ message: 'Password is required' })
   password: string;
}
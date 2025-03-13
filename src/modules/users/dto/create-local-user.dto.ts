import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, Length, MaxLength } from 'class-validator';
import { Match } from '../../../decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocalUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @ApiProperty({
        example: 'John',
        description: 'Primer nombre',
    })
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: 'email@example.com',
        description: 'Email del usuario'
    })
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
    @ApiProperty({
        example: 'Password123!',
        description: '8 dígitos, 1 mayúscula, 1 símbolo',
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @Match("password", { message: "Passwords do not match" })
    @ApiProperty({
        example: 'Password123!',
        description: 'Debe coincidir con el campo password'
    })
    passwordConfirmation: string;
}

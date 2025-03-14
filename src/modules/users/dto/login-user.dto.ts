import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @IsEmail({}, { message: 'Please enter a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @ApiProperty({
        example: 'email@example.com',
        description: 'Email del usuario'
    })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @ApiProperty({
        example: 'Password123!',
        description: '8 dígitos, 1 mayúscula, 1 símbolo'
    })
    password: string;
}
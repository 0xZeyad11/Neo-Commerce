import {
  IsEmail,
  IsString,
  IsOptional,
  Matches,
  IsNotEmpty,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'JohnDoe@Dont109232' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(24)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>/?]).+$/,
    {
      message:
        'Password must include uppercase, lowercase, number, and symbol.',
    },
  )
  password: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}

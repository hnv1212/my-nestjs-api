import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsDefined()
  @IsString()
  @ApiProperty()
  readonly password: string;
}

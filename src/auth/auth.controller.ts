import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Connection } from './models/connection.model';
import {
  E_INCORRECT_EMAIL_OR_PASSWORD,
  E_USER_EMAIL_TAKEN,
} from 'src/common/exceptions';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/domain/users/entities/user.entity';
import { CreateUserDto } from 'src/domain/users/dto/create-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: Connection })
  @ApiNotAcceptableResponse({ description: E_INCORRECT_EMAIL_OR_PASSWORD })
  async login(@Body() loginDto: LoginDto): Promise<Connection> {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  @ApiCreatedResponse({ type: User })
  @ApiNotAcceptableResponse({ description: E_USER_EMAIL_TAKEN })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<Connection> {
    return this.authService.signUp(createUserDto);
  }
}

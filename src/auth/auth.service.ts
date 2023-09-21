import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/domain/users/dto/create-user.dto';
import { User } from 'src/domain/users/entities/user.entity';
import { UsersService } from 'src/domain/users/users.service';
import { LoginDto } from './dto/login.dto';
import { E_INCORRECT_EMAIL_OR_PASSWORD } from 'src/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  getAccessToken(user: User): string {
    return this.jwtService.sign({ sub: user.id, username: user.email });
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      accessToken: this.getAccessToken(user),
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByField(loginDto.email, 'email');
    if (!user) {
      throw new NotAcceptableException(E_INCORRECT_EMAIL_OR_PASSWORD);
    }

    const bcrypt = require('bcrypt');
    if (!(await bcrypt.compare(loginDto.password, user.password)))
      throw new NotAcceptableException(E_INCORRECT_EMAIL_OR_PASSWORD);

    return {
      accessToken: this.getAccessToken(user),
      user,
    };
  }
}

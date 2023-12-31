import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  E_PASSWORD_INCORRECT,
  E_TRANSACTION_NOT_FOUND,
  E_UNAUTHORIZED_ACCESS_TO_RESOURCE,
} from 'src/common/exceptions';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionsService } from '../transactions/transactions.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(UserAuthGuard)
@ApiBasicAuth()
@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionService: TransactionsService,
  ) {}

  @Get()
  @ApiOkResponse({ type: User })
  findOne(@CurrentUser() currentUser): Promise<User> {
    return this.usersService.findOne(currentUser.id);
  }

  @Get('balance')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: E_TRANSACTION_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: E_UNAUTHORIZED_ACCESS_TO_RESOURCE })
  getAccountBalance(@CurrentUser() currentUser): Promise<number> {
    return this.transactionService.getAccountBalance(currentUser.id);
  }

  @Patch('update-profile')
  @ApiOkResponse({ type: User })
  update(@Body() dto: UpdateUserDto, @CurrentUser() currentUser) {
    return this.usersService.update(currentUser.id, dto);
  }

  @Patch('update-password')
  @ApiOkResponse()
  @ApiNotAcceptableResponse({ description: E_PASSWORD_INCORRECT })
  updatePassword(
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
    @CurrentUser() currentUser,
  ) {
    return this.usersService.updatePassword(
      currentPassword,
      newPassword,
      currentUser,
    );
  }

  @Delete()
  @ApiOkResponse()
  async remove(@Body('password') password: string, @CurrentUser() currentUser) {
    await this.usersService.verifyPassword(currentUser.id, password);
    return this.usersService.remove(+currentUser.id);
  }
}

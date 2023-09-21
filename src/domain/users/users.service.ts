import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Raw, Repository } from 'typeorm';
import {
  E_PASSWORD_INCORRECT,
  E_USER_EMAIL_TAKEN,
  E_USER_NOT_FOUND,
} from 'src/common/exceptions';
import { PASSWORD_HASH_SALT } from 'src/common/constants';
import { FindUsersDto } from './dto/find-users.dto';
import { ResultsMetadata } from 'src/common/models/results-metadata.model';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async updateLastSeenAt(user: User): Promise<User> {
    user.lastSeenAt = new Date();
    await this.usersRepo.save(user);
    return user;
  }

  async verifyPassword(id: number, password: string) {
    const user = await this.findOneByField(id);
    if (!user) {
      throw new NotFoundException(E_USER_NOT_FOUND);
    }
    const bcrypt = require('bcrypt');
    if (!(await bcrypt.compare(password, user.password))) {
      throw new NotAcceptableException(E_PASSWORD_INCORRECT);
    }
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new NotAcceptableException(E_USER_EMAIL_TAKEN);
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(dto.password, PASSWORD_HASH_SALT);

    return this.usersRepo.save({ ...dto, password: hashedPassword });
  }

  async findAll({
    offset = 0,
    limit = 12,
    sortField,
    sortOrder,
    email,
    searchQuery,
  }: FindUsersDto = {}): Promise<{ data: User[]; meta: ResultsMetadata }> {
    // Filtering
    const where: any = {};
    if (email) {
      where.email = email;
    }
    if (searchQuery) {
      where.firstName = Raw(
        (alias) => `CONCAT(firstName, " ", lastname) LIKE :name`,
        { name: '%' + searchQuery + '%' },
      );
    }

    // Fetching
    const [data, count] = await this.usersRepo.findAndCount({
      where,
      order: {
        [sortField || 'createdAt']: (sortOrder || 'desc').toUpperCase(),
      },
      skip: offset,
      take: limit || null,
    });

    return {
      data,
      meta: {
        total: count,
        offset: offset,
        limit: limit || null,
      },
    };
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepo.findOne({ where: { id } });
  }

  async findOneByField(
    fieldValue: number | string,
    filedName: string = 'id',
  ): Promise<User> {
    // relations => in case e need to load some user relations
    return await this.usersRepo.findOne({ where: { [filedName]: fieldValue } });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    // Check if there is a user with the same email
    if (typeof dto.email != 'undefined') {
      const existingUser = await this.usersRepo.findOne({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new UnauthorizedException(E_USER_EMAIL_TAKEN);
      }
    }

    // check if user exists
    const user = await this.findOneByField(id);
    if (!user) {
      throw new NotFoundException(E_USER_NOT_FOUND);
    }

    // Update and return user
    Object.assign(user, { ...dto });
    await this.usersRepo.save(user);
    return user;
  }

  async updatePassword(
    currentPassword: string,
    newPassword: string,
    currentUser: User,
  ): Promise<void> {
    // Checking the current password
    const bcrypt = require('bcrypt');
    if (!(await bcrypt.compare(currentPassword, currentUser.password)))
      throw new NotAcceptableException(E_PASSWORD_INCORRECT);

    const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT);

    Object.assign(currentUser, { password: hashedPassword });
    await this.usersRepo.save(currentUser);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOneByField(id);
    if (!user) throw new NotFoundException(E_USER_NOT_FOUND);

    await this.usersRepo.delete(id);
    return user;
  }
}

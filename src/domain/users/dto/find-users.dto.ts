import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindDto } from 'src/common/dto/find.dto';

export class FindUsersDto extends FindDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsString()
  @IsOptional()
  searchQuery?: string;
}

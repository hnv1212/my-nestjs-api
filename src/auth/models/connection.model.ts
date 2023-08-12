import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/models/user.model';

export class Connection {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty()
  accessToken: string;
}

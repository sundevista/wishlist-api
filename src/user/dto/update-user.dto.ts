import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  username: string;
  password: string;
  full_name: string;
  city: string;
  address: string;
  profile_picture: string;
  level: number;
  xp: number;
  wishes: number[];
}

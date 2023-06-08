import {
  IsDefined,
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USER_VALIDATION_REGEXPS } from '../user.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsDefined({ message: '$property should be defined' })
  @MinLength(5, {
    message: '$property should be longer than $constraint1 characters',
  })
  @MaxLength(25, {
    message: '$property should be less than $constraint1 characters',
  })
  @Matches(USER_VALIDATION_REGEXPS.USERNAME_PATTERN, {
    message:
      '$property should include only english lowercase characters, numbers and underscore',
  })
  username: string;

  @ApiProperty()
  @IsDefined({ message: '$property should be defined' })
  @MaxLength(70, {
    message: '$property should be less than $constraint1 characters',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsDefined({ message: '$property should be defined' })
  @MinLength(4, {
    message: '$property should be longer than $constraint1 characters',
  })
  @MaxLength(40, {
    message: '$property should be less than $constraint1 characters',
  })
  full_name: string;

  @ApiProperty()
  @IsDefined({ message: '$property should be defined' })
  @MinLength(8, {
    message: '$property should be longer than $constraint1 characters',
  })
  @MaxLength(32, {
    message: '$property should be less than $constraint1 characters',
  })
  password: string;
}

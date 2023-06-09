import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ default: 'local_user' })
  public username: string;

  @ApiProperty({ default: 'secret_password' })
  public password: string;
}

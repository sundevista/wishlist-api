import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty()
  public refreshToken: string;
}

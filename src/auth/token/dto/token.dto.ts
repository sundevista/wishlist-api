import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class UpdateTokenDto {
  @ApiProperty()
  @IsJWT()
  public refreshToken: string;
}

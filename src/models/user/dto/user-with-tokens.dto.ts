import PublicFile from '../../file/entities/publicFile.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserWithTokensDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public full_name: string;

  @ApiProperty()
  public level: number;

  @ApiProperty()
  public xp: number;

  @ApiProperty()
  public avatar?: PublicFile;

  @ApiProperty()
  public accessToken: string;

  @ApiProperty()
  public refreshToken: string;
}

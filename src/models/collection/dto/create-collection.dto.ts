import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, MaxLength, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ default: 'My Collection' })
  @IsDefined()
  @MinLength(3)
  @MaxLength(16)
  public name: string;

  @ApiProperty({ default: true })
  @IsDefined()
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  public public: boolean;
}

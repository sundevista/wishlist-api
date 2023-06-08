import { Transform } from 'class-transformer';
import { IsDefined, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishDto {
  @ApiProperty()
  @IsDefined()
  @MinLength(4)
  @MaxLength(32)
  public name: string;

  @ApiProperty()
  @IsDefined()
  @MinLength(0)
  @MaxLength(128)
  public description: string;

  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => +value)
  @Min(0)
  @Max(Number.MAX_VALUE)
  public price: number;

  @ApiProperty()
  @IsDefined()
  @Transform(({ value }) => +value)
  @Min(0)
  @Max(5)
  public rating: number;

  @ApiProperty()
  @IsDefined()
  @MinLength(0)
  @MaxLength(128)
  public link: string;

  @ApiProperty({ type: String, format: 'binary' })
  public file: Express.Multer.File;
}

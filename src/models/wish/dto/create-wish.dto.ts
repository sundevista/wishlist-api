import { Transform } from 'class-transformer';
import { IsDefined, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWishDto {
  @ApiProperty({ default: 'Xbox Controller' })
  @IsDefined()
  @MinLength(4)
  @MaxLength(32)
  public name: string;

  @ApiProperty({ default: 'I want it very much, really...' })
  @IsDefined()
  @MinLength(0)
  @MaxLength(128)
  public description: string;

  @ApiProperty({ default: 2500 })
  @IsDefined()
  @Transform(({ value }) => +value)
  @Min(0)
  @Max(Number.MAX_VALUE)
  public price: number;

  @ApiProperty({ default: 4 })
  @IsDefined()
  @Transform(({ value }) => +value)
  @Min(0)
  @Max(5)
  public rating: number;

  @ApiProperty({ default: 'https://ek.ua/xbox-controller' })
  @IsDefined()
  @MinLength(0)
  @MaxLength(128)
  public link: string;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  public file: Express.Multer.File;
}

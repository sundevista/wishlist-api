import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateWishDto {
  @IsDefined()
  @MinLength(4)
  @MaxLength(32)
  public name: string;

  @IsDefined()
  @MinLength(0)
  @MaxLength(128)
  public description: string;

  @IsDefined()
  @Transform(({ value }) => +value)
  @Min(0)
  @Max(Number.MAX_VALUE)
  public price: number;

  @IsDefined()
  @Transform(({ value }) => +value)
  @Min(0)
  @Max(5)
  public rating: number;

  @IsDefined()
  @MinLength(0)
  @MaxLength(128)
  public link: string;
}

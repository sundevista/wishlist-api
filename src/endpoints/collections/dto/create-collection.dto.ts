import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, MaxLength, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @IsDefined()
  @MinLength(3)
  @MaxLength(16)
  public name: string;

  @IsDefined()
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  public public: boolean;
}

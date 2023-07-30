import { PartialType } from '@nestjs/mapped-types';
import Collection from 'src/models/collection/entities/collection.entity';
import PublicFile from 'src/models/file/entities/publicFile.entity';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  public avatar?: PublicFile;
  public collections?: Collection[];

  @IsOptional()
  @MinLength(1)
  @MaxLength(120)
  public bio?: string;
}

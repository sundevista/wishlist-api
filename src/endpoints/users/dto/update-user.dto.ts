import { PartialType } from '@nestjs/mapped-types';
import PublicFile from 'src/endpoints/files/entities/publicFile.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  avatar?: PublicFile;
}

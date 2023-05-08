import { PartialType } from '@nestjs/mapped-types';
import Collection from '../../collections/entities/collection.entity';
import PublicFile from '../../files/entities/publicFile.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  avatar?: PublicFile;
  collections?: Collection[];
}

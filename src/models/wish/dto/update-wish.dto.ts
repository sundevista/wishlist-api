import PublicFile from 'src/models/file/entities/publicFile.entity';
import { CreateWishDto } from './create-wish.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  image?: PublicFile;
}

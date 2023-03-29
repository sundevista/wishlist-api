import { PartialType } from '@nestjs/swagger';
import PublicFile from 'src/endpoints/files/entities/publicFile.entity';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  image?: PublicFile;
}

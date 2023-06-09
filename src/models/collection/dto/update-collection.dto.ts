import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @ApiPropertyOptional()
  public description?: string;
}

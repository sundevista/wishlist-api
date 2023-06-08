import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: String, format: 'binary' })
  public file: Express.Multer.File;
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import PublicFile from './entities/publicFile.entity';
import {
  ALLOWED_EXTENSIONS,
  FILE_SIZE_LIMITATION,
  FILE_VALIDATION_ERRORS,
} from './file.constants';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFileRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}

  public checkFileProperties(dataBuffer: Buffer, filename: string): void {
    if (dataBuffer.length > FILE_SIZE_LIMITATION)
      throw new BadRequestException(FILE_VALIDATION_ERRORS.FILES_TOO_LARGE);
    if (!ALLOWED_EXTENSIONS.includes(filename.split('.').slice(-1)[0])) {
      throw new BadRequestException(FILE_VALIDATION_ERRORS.WRONG_EXTENSION);
    }
  }

  public async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<PublicFile> {
    this.checkFileProperties(dataBuffer, filename);

    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}.${filename.split('.').pop()}`,
        ACL: 'public-read',
      })
      .promise();

    const newFile = this.publicFileRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });

    await this.publicFileRepository.save(newFile);
    return newFile;
  }

  public async deletePublicFile(fileId: string): Promise<void> {
    const file = await this.publicFileRepository.findOneBy({ id: fileId });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.publicFileRepository.delete(fileId);
  }

  // Used to clean files those are not referenced by any wish or user
  public async cleanupOrphanedFiles(): Promise<void> {
    const orphans: PublicFile[] = await this.publicFileRepository.query(
      'SELECT public_file.* FROM public_file ' +
        'LEFT JOIN wish w on public_file.id = w."imageId" ' +
        'LEFT JOIN "user" u on public_file.id = u."avatarId" ' +
        'WHERE w.id IS NULL AND u.id IS NULL',
    );
    orphans.forEach((file: PublicFile) => this.deletePublicFile(file.id));
  }
}
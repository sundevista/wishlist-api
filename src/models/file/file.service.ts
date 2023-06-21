import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
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
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(
    @InjectRepository(PublicFile)
    private readonly publicFileRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = configService.get('s3.bucketName');
    this.region = configService.get('s3.region');
    this.s3Client = new S3Client({ region: this.region });
  }

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

    const objectKey = `${uuid()}.${filename.split('.').pop()}`;
    const objectUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${objectKey}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        Body: dataBuffer,
        ACL: 'public-read',
      }),
    );

    const newFile = this.publicFileRepository.create({
      key: objectKey,
      url: objectUrl,
    });

    await this.publicFileRepository.save(newFile);
    return newFile;
  }

  public async deletePublicFile(fileId: string): Promise<void> {
    const file = await this.publicFileRepository.findOneBy({ id: fileId });

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: file.key,
      }),
    );

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

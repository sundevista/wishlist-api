import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CollectionService } from '../collection/collection.service';
import { FileService } from '../file/file.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import Wish from './entities/wish.entity';
import { WISH_VALIDATION_ERRORS } from './wish.constants';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private collectionService: CollectionService,
    private fileService: FileService,
  ) {}

  public async create(
    userId: string,
    collectionId: string,
    file: Express.Multer.File,
    createWishDto: CreateWishDto,
  ) {
    const collection = await this.collectionService.findOneWithRelations(
      collectionId,
      ['user', 'wishes'],
    );

    this.collectionService.checkCollectionAccess(collection, userId);

    const newWish = await this.wishRepository.create(createWishDto);

    if (file)
      await this.addImage(userId, newWish.id, file.buffer, file.originalname);

    collection.wishes = [...collection.wishes, newWish];
    await this.collectionService.saveEntity(collection);

    return newWish;
  }

  public async findOne(id: string) {
    const wish = await this.wishRepository.findOneBy({ id });

    if (!wish)
      throw new NotFoundException(WISH_VALIDATION_ERRORS.WISH_NOT_FOUND);

    return wish;
  }

  public async findCollectionsWishes(collectionId: string): Promise<Wish[]> {
    const collection = await this.collectionService.findOneWithRelations(
      collectionId,
      ['wishes'],
    );
    return collection.wishes;
  }

  public async update(
    userId: string,
    wishId: string,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['collection', 'collection.user'],
    });

    this.collectionService.checkCollectionAccess(wish.collection, userId);

    if (!wish)
      throw new NotFoundException(WISH_VALIDATION_ERRORS.WISH_NOT_FOUND);

    await this.wishRepository.update(wishId, updateWishDto);

    return wish;
  }

  public async addImage(
    userId: string,
    wishId: string,
    imageBuffer: Buffer,
    filename: string,
  ) {
    await this.deleteImage(userId, wishId);

    const image = await this.fileService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.wishRepository.update(wishId, { image });
    return image;
  }

  public async deleteImage(userId: string, wishId: string) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['collection', 'collection.user'],
    });

    this.collectionService.checkCollectionAccess(wish.collection, userId);

    const fileId = wish.image?.id;
    if (fileId) {
      await this.wishRepository.update(wishId, {
        image: null,
      });
      await this.fileService.deletePublicFile(fileId);
    }
  }

  public async remove(userId: string, wishId: string) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['collection', 'collection.user'],
    });

    this.collectionService.checkCollectionAccess(wish.collection, userId);

    await this.deleteImage(userId, wishId);

    const deleteResponse = await this.wishRepository.delete(wishId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(WISH_VALIDATION_ERRORS.WISH_NOT_FOUND);
    }
  }
}

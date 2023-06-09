import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CollectionService } from '../collection/collection.service';
import { FilesService } from '../file/files.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import Wish from './entities/wish.entity';
import { WISH_VALIDATION_ERRORS } from './wish.constants';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private collectionsService: CollectionService,
    private filesService: FilesService,
  ) {}

  public async create(
    userId: string,
    collectionId: string,
    file: Express.Multer.File,
    createWishDto: CreateWishDto,
  ) {
    const collection = await this.collectionsService.findOneWithRelations(
      collectionId,
      ['user', 'wishes'],
    );

    this.collectionsService.checkCollectionAccess(collection, userId);

    const newWish = await this.wishesRepository.create(createWishDto);

    if (file)
      await this.addImage(userId, newWish.id, file.buffer, file.originalname);

    collection.wishes = [...collection.wishes, newWish];
    await this.collectionsService.saveEntity(collection);

    return newWish;
  }

  public async findOne(id: string) {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish)
      throw new NotFoundException(WISH_VALIDATION_ERRORS.WISH_NOT_FOUND);

    return wish;
  }

  public async findCollectionsWishes(collectionId: string): Promise<Wish[]> {
    const collection = await this.collectionsService.findOneWithRelations(
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
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['collection', 'collection.user'],
    });

    this.collectionsService.checkCollectionAccess(wish.collection, userId);

    if (!wish)
      throw new NotFoundException(WISH_VALIDATION_ERRORS.WISH_NOT_FOUND);

    await this.wishesRepository.update(wishId, updateWishDto);

    return wish;
  }

  public async addImage(
    userId: string,
    wishId: string,
    imageBuffer: Buffer,
    filename: string,
  ) {
    await this.deleteImage(userId, wishId);

    const image = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.wishesRepository.update(wishId, { image });
    return image;
  }

  public async deleteImage(userId: string, wishId: string) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['collection', 'collection.user'],
    });

    this.collectionsService.checkCollectionAccess(wish.collection, userId);

    const fileId = wish.image?.id;
    if (fileId) {
      await this.wishesRepository.update(wishId, {
        image: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }

  public async remove(userId: string, wishId: string) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['collection', 'collection.user'],
    });

    this.collectionsService.checkCollectionAccess(wish.collection, userId);

    await this.deleteImage(userId, wishId);

    const deleteResponse = await this.wishesRepository.delete(wishId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(WISH_VALIDATION_ERRORS.WISH_NOT_FOUND);
    }
  }
}

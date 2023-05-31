import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionsService } from '../collection/collections.service';
import { FilesService } from '../file/files.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import Wish from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private collectionsService: CollectionsService,
    private filesService: FilesService,
  ) {}

  async create(
    userId: string,
    collectionId: number,
    file: Express.Multer.File,
    createWishDto: CreateWishDto,
  ) {
    const collection = await this.collectionsService.findOneWithParentRelations(
      collectionId,
    );

    if (!collection)
      throw new NotFoundException('Collection with given id was not found');

    if (userId !== collection.user.id)
      throw new BadRequestException('You have no access to this collection');

    const newWish = await this.wishesRepository.create(createWishDto);
    this.wishesRepository.save(newWish);

    if (collection.wishes) collection.wishes.push(newWish);
    else collection.wishes = [newWish];

    await this.collectionsService.saveEntity(collection);

    this.addImage(userId, newWish.id, file.buffer, file.originalname);

    return newWish;
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException('Wish with given id was not found');

    return wish;
  }

  async update(userId: string, wishId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['collection', 'collection.user'],
    });

    if (userId !== wish.collection.user.id)
      throw new BadRequestException('You have no access to this collection');

    if (!wish) throw new NotFoundException('Wish with given id was not found');

    await this.wishesRepository.update(wishId, updateWishDto);

    return wish;
  }

  async addImage(
    userId: string,
    wishId: number,
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

  async deleteImage(userId: string, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['collection', 'collection.user'],
    });

    if (wish.collection.user.id !== userId)
      throw new BadRequestException('You have no access to this wish');

    const fileId = wish.image?.id;
    if (fileId) {
      await this.wishesRepository.update(wishId, {
        image: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }

  async remove(userId: string, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['collection', 'collection.user'],
    });

    if (wish.collection.user.id !== userId)
      throw new BadRequestException('You have no access to this wish');

    await this.deleteImage(userId, wishId);

    const deleteResponse = await this.wishesRepository.delete(wishId);
    if (!deleteResponse.affected) {
      throw new NotFoundException('Wish with given id was not found');
    }
  }
}

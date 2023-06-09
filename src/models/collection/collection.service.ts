import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from '../file/files.service';

import { UserService } from '../user/user.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import Collection from './entities/collection.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
    private filesService: FilesService,
    private usersService: UserService,
  ) {}

  async saveEntity(collection: Collection) {
    await this.collectionsRepository.save(collection);
  }

  //TODO: use cascade actions
  async create(userId: string, createCollectionDto: CreateCollectionDto) {
    const newCollection =
      this.collectionsRepository.create(createCollectionDto);

    const user = await this.usersService.findOneWithRelations(userId, [
      'collections',
    ]);

    user.collections = [...user.collections, newCollection];
    await this.usersService.saveEntity(user);

    return newCollection;
  }

  async findOne(id: number) {
    const collection = this.collectionsRepository.findOneBy({ id });

    if (!collection) {
      throw new NotFoundException('Collection with given id was not found');
    }

    return collection;
  }

  async findOneWithChildRelations(id: number) {
    const collection = this.collectionsRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });

    if (!collection) {
      throw new NotFoundException('Collection with given id was not found');
    }

    return collection;
  }

  async findOneWithRelations(id: number, relations: string[] = []) {
    const collection = this.collectionsRepository.findOne({
      where: { id },
      relations: relations,
    });

    if (!collection) {
      throw new NotFoundException('Collection with given id was not found');
    }

    return collection;
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) {
    await this.collectionsRepository.update(id, updateCollectionDto);
    const updatedCollection = await this.collectionsRepository.findOneBy({
      id,
    });

    if (!updatedCollection) {
      throw new NotFoundException('Collection with given id was not found');
    }

    return updatedCollection;
  }

  async remove(userId: string, collectionId: number) {
    const collection = await this.collectionsRepository.findOne({
      where: { id: collectionId },
      relations: ['user'],
    });

    if (collection.user.id !== userId)
      throw new BadRequestException('You have no access to this collection');

    const deleteResponse = await this.collectionsRepository.delete(
      collectionId,
    );
    if (!deleteResponse.affected) {
      throw new NotFoundException('Collection with given id was not found');
    }
    await this.filesService.cleanupOrphanedFiles();
  }
}

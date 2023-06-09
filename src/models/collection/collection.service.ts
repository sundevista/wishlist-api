import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilesService } from '../file/files.service';
import { UserService } from '../user/user.service';
import { COLLECTION_VALIDATION_ERRORS } from './collection.constants';
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

  public async saveEntity(collection: Collection): Promise<void> {
    await this.collectionsRepository.save(collection);
  }

  public async create(
    userId: string,
    createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    const newCollection =
      this.collectionsRepository.create(createCollectionDto);

    const user = await this.usersService.findOneWithRelations(userId, [
      'collections',
    ]);

    user.collections = [...user.collections, newCollection];
    await this.usersService.saveEntity(user);

    return newCollection;
  }

  public async findOne(id: string): Promise<Collection> {
    const collection = this.collectionsRepository.findOneBy({ id });

    if (!collection) {
      throw new NotFoundException(
        COLLECTION_VALIDATION_ERRORS.COLLECTION_NOT_FOUND,
      );
    }

    return collection;
  }

  public async findOneWithChildRelations(id: string): Promise<Collection> {
    return this.findOneWithRelations(id, ['wishes']);
  }

  public async findOneWithRelations(
    id: string,
    relations: string[] = [],
  ): Promise<Collection> {
    const collection = this.collectionsRepository.findOne({
      where: { id },
      relations: relations,
    });

    if (!collection) {
      throw new NotFoundException(
        COLLECTION_VALIDATION_ERRORS.COLLECTION_NOT_FOUND,
      );
    }

    return collection;
  }

  public async getAllUsersCollections(userId: string): Promise<Collection[]> {
    const user = await this.usersService.findOneWithRelations(userId, [
      'collections',
    ]);
    return user.collections;
  }

  public async getPublicUsersCollections(
    username: string,
  ): Promise<Collection[]> {
    const user = await this.usersService.findOneByUsername(username, [
      'collections',
    ]);
    return user.collections.filter(
      (collection: Collection) => collection.public,
    );
  }

  public checkCollectionAccess(collection: Collection, userId: string): void {
    if (userId !== collection.user.id)
      throw new BadRequestException(
        COLLECTION_VALIDATION_ERRORS.ACCESS_NOT_PERMITTED,
      );
  }

  public async update(
    id: string,
    updateCollectionDto: UpdateCollectionDto,
  ): Promise<Collection> {
    await this.collectionsRepository.update(id, updateCollectionDto);
    const updatedCollection = await this.collectionsRepository.findOneBy({
      id,
    });

    if (!updatedCollection) {
      throw new NotFoundException(
        COLLECTION_VALIDATION_ERRORS.COLLECTION_NOT_FOUND,
      );
    }

    return updatedCollection;
  }

  public async remove(userId: string, collectionId: string): Promise<void> {
    const collection = await this.collectionsRepository.findOne({
      where: { id: collectionId },
      relations: ['user'],
    });

    if (collection.user.id !== userId)
      throw new BadRequestException(
        COLLECTION_VALIDATION_ERRORS.ACCESS_NOT_PERMITTED,
      );

    const deleteResponse = await this.collectionsRepository.delete(
      collectionId,
    );
    if (!deleteResponse.affected) {
      throw new NotFoundException(
        COLLECTION_VALIDATION_ERRORS.COLLECTION_NOT_FOUND,
      );
    }
    await this.filesService.cleanupOrphanedFiles();
  }
}

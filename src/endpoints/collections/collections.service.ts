import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../users/users.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import Collection from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    private usersService: UserService,
  ) {}

  async create(userId: string, createCollectionDto: CreateCollectionDto) {
    const newCollection = this.collectionRepository.create(createCollectionDto);

    await this.collectionRepository.save(newCollection);

    const user = await this.usersService.findOneById(userId);

    if (user.collections) user.collections.push(newCollection);
    else user.collections = [newCollection];

    this.usersService.saveEntity(user);

    return newCollection;
  }

  async findOne(id: number) {
    const collection = this.collectionRepository.findOneBy({ id });

    if (!collection) {
      throw new NotFoundException('Collection with given id was not found');
    }

    return collection;
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) {
    await this.collectionRepository.update(id, updateCollectionDto);
    const updatedCollection = await this.collectionRepository.findOneBy({ id });

    if (!updatedCollection) {
      throw new NotFoundException('Collection with given id was not found');
    }

    return updatedCollection;
  }

  async remove(userId: string, collectionId: number) {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId },
      relations: ['user'],
    });

    if (collection.user.id !== userId)
      throw new BadRequestException('You have no access to this collection');

    const deleteResponse = await this.collectionRepository.delete(collectionId);
    if (!deleteResponse.affected) {
      throw new NotFoundException('Collection with given id was not found');
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import Collection from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const newCollection = this.collectionRepository.create(createCollectionDto);
    await this.collectionRepository.save(newCollection);
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

  async remove(id: number) {
    const deleteResponse = await this.collectionRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('Collection with given id was not found');
    }
  }
}

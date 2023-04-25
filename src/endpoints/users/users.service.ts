import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private filesService: FilesService,
  ) {}

  async saveEntity(user: User) {
    await this.userRepository.save(user);
  }

  async signup(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const newUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);

    return newUser;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOneByUsername(username: string, showPrivateInfo = false) {
    const user = await this.userRepository.findOneBy({ username });

    if (!showPrivateInfo && user?.collections) {
      user.collections = user.collections.filter(
        (collection) => collection.public,
      );
    }

    if (!user)
      throw new NotFoundException('User with given username was not found');

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user)
      throw new NotFoundException('User with given email was not found');

    return user;
  }

  async findOneById(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new NotFoundException('User with given id was not found');

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(userId, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ id: userId });

    if (!updatedUser) {
      throw new NotFoundException('User with given id was not found');
    }

    return updatedUser;
  }

  async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
    // Delete old avatar if exists
    await this.deleteAvatar(userId);

    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.userRepository.update(userId, { avatar });
    return avatar;
  }

  async deleteAvatar(userId: string) {
    const user = await this.findOneById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.userRepository.update(userId, {
        avatar: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }

  async removeByUsername(username: string) {
    const user = await this.findOneByUsername(username);
    await this.removeById(user.id);
  }

  async removeById(userId: string) {
    const deleteResponse = await this.userRepository.delete(userId);
    if (!deleteResponse.affected) {
      throw new NotFoundException('User not found');
    }
  }
}

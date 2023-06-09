import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCacheService } from '../../auth/auth-cache.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FilesService } from '../file/files.service';
import { PASSWORD_SALT_ROUNDS, USER_VALIDATION_ERRORS } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private filesService: FilesService,
    private authCacheService: AuthCacheService,
  ) {}

  public async saveEntity(user: User) {
    await this.userRepository.save(user);
  }

  private async hashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  }

  public async isPasswordMatches(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashedPassword(createUserDto.password);

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    return newUser;
  }

  public async findAll() {
    return this.userRepository.find();
  }

  public async findOneByUsername(username: string, showPrivateInfo = false) {
    const user = await this.userRepository.findOneBy({ username });

    // TODO: It should be done more properly
    if (!showPrivateInfo && user?.collections) {
      user.collections = user.collections.filter(
        (collection) => collection.public,
      );
    }

    if (!user)
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);

    return user;
  }

  public async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user)
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);

    return user;
  }

  public async findOneById(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user)
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);

    return user;
  }

  public async findOneWithRelations(userId: string, relations: string[] = []) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: relations,
    });

    if (!user)
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);

    return user;
  }

  public async update(userId: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(userId, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ id: userId });

    if (!updatedUser) {
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);
    }

    return updatedUser;
  }

  public async addAvatar(
    userId: string,
    imageBuffer: Buffer,
    filename: string,
  ) {
    // Delete old avatar if exists
    await this.deleteAvatar(userId);

    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.userRepository.update(userId, { avatar });
    return avatar;
  }

  public async deleteAvatar(userId: string) {
    const user = await this.findOneById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.userRepository.update(userId, {
        avatar: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }

  public async removeById(userId: string) {
    await this.deleteAvatar(userId);
    const deleteResponse = await this.userRepository.delete(userId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);
    }
    await this.authCacheService.wipeAccessTokens(userId);
    await this.filesService.cleanupOrphanedFiles();
  }
}

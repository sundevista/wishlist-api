import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCacheService } from '../../auth/auth-cache.service';
import PublicFile from '../file/entities/publicFile.entity';
import SearchService from '../search/search.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FileService } from '../file/file.service';
import { PASSWORD_SALT_ROUNDS, USER_VALIDATION_ERRORS } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private fileService: FileService,
    private searchService: SearchService,
    private authCacheService: AuthCacheService,
  ) {}

  public async saveEntity(user: User): Promise<void> {
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

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashedPassword(createUserDto.password);

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
    await this.searchService.indexUser(newUser);

    return newUser;
  }

  public async searchUsers(text: string): Promise<User[]> {
    const results = await this.searchService.searchUser(text);
    const ids = results.map((result) => result.id);
    if (!ids.length) return [];
    return this.userRepository.find({ where: { id: In(ids) } });
  }

  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOneByUsername(
    username: string,
    relations: string[] = [],
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: relations,
    });

    if (!user)
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);

    return user;
  }

  public async checkUsernameForAvailability(
    username: string,
  ): Promise<boolean> {
    try {
      await this.findOneByUsername(username);
      return false;
    } catch (err) {
      return true;
    }
  }

  public async checkEmailForAvailability(email: string): Promise<boolean> {
    try {
      await this.findOneByEmail(email);
      return false;
    } catch (err) {
      return true;
    }
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user)
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);

    return user;
  }

  public async findOneWithRelations(
    userId: string,
    relations: string[] = [],
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: relations,
    });

    if (!user)
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);

    return user;
  }

  public async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    await this.userRepository.update(userId, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ id: userId });

    if (!updatedUser) {
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);
    }

    await this.searchService.update(updatedUser);

    return updatedUser;
  }

  public async addAvatar(
    userId: string,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<PublicFile> {
    // Delete old avatar if exists
    await this.deleteAvatar(userId);

    const avatar = await this.fileService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.userRepository.update(userId, { avatar });
    return avatar;
  }

  public async deleteAvatar(userId: string): Promise<void> {
    const user = await this.findOneWithRelations(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.userRepository.update(userId, {
        avatar: null,
      });
      await this.fileService.deletePublicFile(fileId);
    }
  }

  public async removeById(userId: string): Promise<void> {
    await this.deleteAvatar(userId);
    const deleteResponse = await this.userRepository.delete(userId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);
    }
    await this.searchService.remove(userId);
    await this.authCacheService.wipeAccessTokens(userId);
    await this.fileService.cleanupOrphanedFiles();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FilesService } from '../files/files.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import SearchService from '../search/search.service';
import { faker } from '@faker-js/faker';
import * as cliProgress from 'cli-progress';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private filesService: FilesService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userSearchService: SearchService,
  ) {}

  createRandomUserObject(): CreateUserDto {
    return {
      email: `x_${faker.person.suffix()}_${faker.internet.email()}`,
      full_name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      password: `${faker.internet.password()}`,
      username: `x_${faker.internet.userName()}_${faker.person.zodiacSign()}`,
    };
  }

  async seedUsers(count: number) {
    if (count > 0) {
      const bar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic,
      );

      bar.start(count, 0);
      for (let i = 0; i < count; i++) {
        try {
          const newUser = await this.userRepository.create(
            this.createRandomUserObject(),
          );
          await this.userRepository.save(newUser);
          await this.userSearchService.indexUser(newUser);
        } catch (ex) {
          i--;
        }
        bar.update(i);
      }
      bar.update(count);
      bar.stop();
    }
  }

  async saveEntity(user: User) {
    await this.userRepository.save(user);
  }

  async signup(createUserDto: CreateUserDto) {
    // Webhook email verification
    /*this.httpService
      .post(this.configService.get<string>('WEBHOOK_URL'), {
        email: createUserDto.email,
      })
      .subscribe({
        complete: () => {
          console.log('sent email verification link');
        },
        error: (err) => {
          console.error(err);
        },
      });*/

    // Salting password
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    // Creating, saving and indexing user
    const newUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    await this.userSearchService.indexUser(newUser);

    return newUser;
  }

  async searchUsers(text: string) {
    const results = await this.userSearchService.searchUser(text);
    const ids = results.map((result) => result.id);
    if (!ids.length) return [];
    return this.userRepository.find({ where: { id: In(ids) } });
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

    await this.userSearchService.update(updatedUser);

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
    await this.userSearchService.remove(userId);
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

import {Injectable, NotFoundException, OnModuleInit} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from "./entities/user.entity";

@Injectable()
export class UserService implements OnModuleInit {
  private userCollection: User[] = [];

  onModuleInit() {
    const count = this.userCollection.length;

    if (count === 0) {
      const seedData: User[] = [
        {
          id: 1,
          username: 'mamahohotala',
          full_name: 'Evgeniy Klopotenko',
          password: 'ilovemymom123',
          city: 'Kyiv',
          address: 'Shevchenka 2',
          profile_picture: '',
          level: 2,
          xp: 100,
          wishes: [],
        },
        {
          id: 2,
          username: 'danuhavoin1997',
          password: '123123qwerty',
          full_name: 'Danylo Vershenko',
          city: 'Krakiv',
          address: 'Bobra mach 2',
          profile_picture: '',
          level: 3,
          xp: 0,
          wishes: [1, 2],
        },
        {
          id: 3,
          username: 'sanya_sysadmin',
          password: 'admin',
          full_name: 'Alex Python',
          city: 'Rivne',
          address: 'Peremogy 34',
          profile_picture: '',
          level: 1,
          xp: 0,
          wishes: [3],
        },
      ];

      seedData.forEach(user => this.userCollection.push(user));
    }
  }

  create(createUserDto: CreateUserDto) {
    const entity: User = {
      id: this.getAvailableId(),
      username: createUserDto.username,
      password: createUserDto.password,
      full_name: createUserDto.full_name,
      city: '',
      address: '',
      profile_picture: '',
      level: 1,
      xp: 0,
      wishes: []
    };

    this.userCollection.push(entity);
    return entity;
  }

  findAll() {
    return this.userCollection;
  }

  findOne(id: number) {
    const entity =  this.userCollection.find(user => user.id === id);

    if (!entity) throw new NotFoundException('Invalid user id');

    return entity;
  }

  remove(id: number) {
    const entity = this.userCollection.find(user => user.id === id);

    if (!entity) throw new NotFoundException('Invalid user id');

    this.userCollection = this.userCollection.filter(user => user.id !== id);
    return entity;
  }

  getAvailableId(): number {
    return this.userCollection.length + 1;
  }
}

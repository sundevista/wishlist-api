import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {FetchUsersDto} from "./dto/fetch-users.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    return this.userModel.create(createUserDto);
  }

  async findAll(): Promise<FetchUsersDto[]> {
    return this.userModel.find();
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ username });

    if (!user)
      throw new NotFoundException('User with given username was not found');

    return user;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ username }, updateUserDto, {
      runValidators: true,
    });
  }

  async remove(username: string) {
    return this.userModel.findOneAndRemove({ username });
  }
}

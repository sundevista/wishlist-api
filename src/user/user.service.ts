import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new NotFoundException('User with given email was not found');

    return user;
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ email }, updateUserDto, { runValidators: true });
  }

  async remove(email: string) {
    return this.userModel.findOneAndRemove({ email });
  }
}

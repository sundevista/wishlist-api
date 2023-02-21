import {Controller, Get, Post, Body, Patch, Param, Delete, UseFilters} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ValidationErrorFilter} from "../exceptions/validation-error.filter";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(new ValidationErrorFilter())
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Patch(':email')
  @UseFilters(new ValidationErrorFilter())
  async update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(email, updateUserDto);
  }

  @Delete(':email')
  async remove(@Param('email') email: string) {
    return this.userService.remove(email);
  }
}

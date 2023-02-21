import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationErrorFilter } from "../exceptions/validation-error.filter";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(new ValidationErrorFilter())
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Get('login')
  async login(@Body() data: { email: string, password: string }) {
    return this.userService.login(data.email, data.password);
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

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationErrorFilter } from '../exceptions/validation-error.filter';
import { Public } from '../decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @UseFilters(new ValidationErrorFilter())
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Public()
  @Get()
  async fetchUsers() {
    return this.userService.findAll();
  }

  @Public()
  @Get(':username')
  async findOne(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Patch()
  @UseFilters(new ValidationErrorFilter())
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete(':username')
  async remove(@Param('username') username: string) {
    return this.userService.remove(username);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Req, ClassSerializerInterceptor, UseInterceptors, SerializeOptions,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationErrorFilter } from '../exceptions/validation-error.filter';
import { Public } from '../decorators/public.decorator';
import {FETCH_ME, FETCH_ONE, FETCH_USERS} from "./entities/user.entity";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @UseFilters(new ValidationErrorFilter())
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Get()
  @Public()
  @SerializeOptions({ groups: [FETCH_USERS] })
  async fetchUsers() {
    return this.userService.findAll();
  }

  @Get(':username')
  @Public()
  @SerializeOptions({ groups: [FETCH_ONE] })
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

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
  SerializeOptions,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationErrorFilter } from '../../exceptions/validation-error.filter';
import { Public } from '../../decorators/public.decorator';
import { FETCH_ONE, FETCH_USERS, User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @UseFilters(new ValidationErrorFilter())
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.signup(createUserDto);
  }

  @Get()
  @Public()
  @SerializeOptions({ groups: [FETCH_USERS] })
  async fetchUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':username')
  @Public()
  @SerializeOptions({ groups: [FETCH_ONE] })
  async findOne(@Param('username') username: string): Promise<User> {
    return this.userService.findOneByUsername(username);
  }

  @Patch()
  @UseFilters(new ValidationErrorFilter())
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete(':username')
  async remove(@Param('username') username: string): Promise<void> {
    return this.userService.remove(username);
  }
}

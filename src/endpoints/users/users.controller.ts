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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationErrorFilter } from '../../exceptions/validation-error.filter';
import { Public } from '../../decorators/public.decorator';
import { FETCH_ONE, FETCH_USERS, User, UserRole } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../auth/interface/requestWithUser.interface';
import { Roles } from '../../decorators/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(
      req.user.id,
      file.buffer,
      file.originalname,
    );
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
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete()
  async removeSelf(@Req() req: RequestWithUser): Promise<void> {
    return this.userService.removeById(req.user.id);
  }

  @Delete(':username')
  @Roles(UserRole.Admin)
  async removeSomeone(@Param('username') username: string): Promise<void> {
    return this.userService.removeByUsername(username);
  }
}

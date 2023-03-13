import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  SerializeOptions,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FETCH_ME, FETCH_ONE, User } from "./entities/user.entity";
import { Public } from '../../decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SerializeOptions({ groups: [FETCH_ONE, FETCH_ME] })
  async findMe(@Req() req): Promise<User> {
    return this.userService.findOneById(req.user.id);
  }

  @Get('isUsernameAvailable')
  @Public()
  async isUsernameAvailable(@Query() query): Promise<string> {
    return (await this.userService.findOneByUsername(query.username)).username;
  }

  @Get('isEmailAvailable')
  @Public()
  async isEmailAvailable(@Query() query): Promise<string> {
    return (await this.userService.findOneByEmail(query.email)).email;
  }

  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('image'))
  async setAvatar(@Req() req, @UploadedFile() image: Express.Multer.File): Promise<User> {
    return this.userService.update(req.user.id, { avatar: image.filename });
  }
}

import { Controller, Get, Query, Req, SerializeOptions } from '@nestjs/common';
import { UserService } from './users.service';
import { FETCH_ME, FETCH_ONE, User } from './entities/user.entity';
import { Public } from '../../auth/decorator/public.decorator';
import { RequestWithUser } from '../../auth/interface/request-with-user.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SerializeOptions({ groups: [FETCH_ONE, FETCH_ME] })
  async findMe(@Req() req: RequestWithUser): Promise<User> {
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
}

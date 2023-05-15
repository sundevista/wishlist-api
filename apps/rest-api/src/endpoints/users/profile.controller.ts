import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  SerializeOptions,
} from '@nestjs/common';
import { UserService } from './users.service';
import {
  FETCH_ME,
  FETCH_ONE,
  FETCH_USERS,
  User,
  UserRole,
} from './entities/user.entity';
import { Public } from '../../decorators/public.decorator';
import { RequestWithUser } from '../auth/interface/request-with-user.interface';
import { Roles } from '../../decorators/roles.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SerializeOptions({ groups: [FETCH_ONE, FETCH_ME] })
  async findMe(@Req() req: RequestWithUser): Promise<User> {
    return this.userService.findOneById(req.user.id);
  }

  @Get('search')
  @Public()
  @SerializeOptions({ groups: [FETCH_USERS] })
  async searchUser(@Query('query') search: string) {
    if (search) {
      return this.userService.searchUsers(search);
    }
    return this.userService.findAll();
  }

  @Post('seedUsers')
  @Roles(UserRole.Admin)
  async seedUsers(@Query('count') count: string) {
    return this.userService.seedUsers(+count);
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

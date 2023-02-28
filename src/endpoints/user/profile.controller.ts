import { Controller, Get, Param, Query, Req, SerializeOptions } from "@nestjs/common";
import { UserService } from './user.service';
import { FETCH_ME, FETCH_ONE } from './entities/user.entity';
import { Public } from "../../decorators/public.decorator";

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SerializeOptions({ groups: [FETCH_ONE, FETCH_ME] })
  async findMe(@Req() req) {
    return this.userService.findOneById(req.user.id);
  }

  @Get('isUsernameAvailable')
  @Public()
  async isUsernameAvailable(@Query() query) {
    return (await this.userService.findOneByUsername(query.username)).username;
  }

  @Get('isEmailAvailable')
  @Public()
  async isEmailAvailable(@Query() query) {
    return (await this.userService.findOneByEmail(query.email)).email;
  }
}

import {Controller, Get, Req, SerializeOptions} from "@nestjs/common";
import {UserService} from "./user.service";
import {FETCH_ME, FETCH_ONE} from "./entities/user.entity";

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SerializeOptions({ groups: [FETCH_ONE, FETCH_ME] })
  async findMe(@Req() req) {
    return this.userService.findOneById(req.user.id);
  }
}

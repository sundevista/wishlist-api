import {CreateUserDto} from "../user/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import {UserService} from "../user/user.service";
import {HttpException, HttpStatus} from "@nestjs/common";

export class AuthenticationService {
  constructor(
    private readonly userService: UserService
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.userService.create(createUserDto)
    user.password = null;

    return user;
  }

  public async getAuthenticatedUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching)
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);

    user.password = null;

    return user;
  }
}

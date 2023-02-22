import { Injectable } from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByUsername(username);

    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user.toJSON();
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }
}

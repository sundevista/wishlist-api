import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interface/tokenPayload.interface';
import { userEmail } from '../../constants/regexp';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(credential: string, pass: string) {
    let user;

    if (userEmail.test(credential)) {
      user = await this.userService.findOneByEmail(credential);
    } else {
      user = await this.userService.findOneByUsername(credential);
    }

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; //TODO: make simple mapper
      return result;
    }

    return null;
  }

  async login(user: TokenPayload) {
    const payload = { username: user.username, sub: user.id };
    const foundUser = await this.userService.findOneById(user.id);
    const { password, id, collections, ...rest } = foundUser; //TODO: make simple mapper
    return { ...rest, access_token: this.jwtService.sign(payload) };
  }
}

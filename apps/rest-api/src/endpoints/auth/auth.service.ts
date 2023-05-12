import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { userEmail } from '../../constants/regexp';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { LoginData } from './interface/login-data.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(credential: string, pass: string): Promise<User | null> {
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

  async signin(loginData: LoginData): Promise<{ access_token: string }> {
    const validatedUser = await this.validateUser(
      loginData.username,
      loginData.password,
    );

    if (!validatedUser) throw new UnauthorizedException();

    const payload = {
      username: validatedUser.username,
      sub: validatedUser.id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signup(createUserDto: CreateUserDto) {
    const pass = createUserDto.password;
    await this.userService.signup(createUserDto);
    return this.signin({
      username: createUserDto.username,
      password: pass,
    });
  }
}

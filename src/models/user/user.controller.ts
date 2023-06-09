import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  SerializeOptions,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationErrorFilter } from '../../utils/exceptions/validation-error.filter';
import { FETCH_ME, FETCH_ONE, FETCH_USERS, User } from './entities/user.entity';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { UserData } from './decorator/user.decorator';
import { SWAGGER_USER_RESPONSES, SWAGGER_USER_SUMMARY } from './user.constants';
import PublicFileEntity from '../file/entities/publicFile.entity';
import { UsernameQueryDto } from './dto/username-query.dto';
import { EmailQueryDto } from './dto/email-query.dto';
import { FileUploadDto } from './dto/file-upload.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.FETCH_USERS })
  @ApiCreatedResponse({ type: Array<User> })
  @SerializeOptions({ groups: [FETCH_USERS] })
  @Get()
  public async fetchUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.FIND_ONE })
  @ApiCreatedResponse({ type: User })
  @SerializeOptions({ groups: [FETCH_ONE] })
  @Get(':username')
  public async findOne(@Param('username') username: string): Promise<User> {
    return this.userService.findOneByUsername(username);
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.FETCH_PROFILE })
  @ApiCreatedResponse({ type: User })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @SerializeOptions({ groups: [FETCH_ME, FETCH_ONE] })
  @Get('profile/me')
  public async fetchProfile(@UserData('userId') userId: string): Promise<User> {
    return this.userService.findOneById(userId);
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.UPDATE })
  @ApiCreatedResponse({ type: User })
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new ValidationErrorFilter())
  @Patch()
  public async update(
    @UserData('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(userId, updateUserDto);
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.ADD_AVATAR })
  @ApiCreatedResponse({ type: PublicFileEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('avatar')
  public async addAvatar(
    @UserData('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PublicFileEntity> {
    return this.userService.addAvatar(userId, file.buffer, file.originalname);
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.REMOVE_SELF })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete()
  public async removeSelf(@UserData('userId') userId: string): Promise<void> {
    return this.userService.removeById(userId);
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.IS_USERNAME_AVAILABLE })
  @ApiQuery({ name: 'username', type: String })
  @ApiResponse({
    status: 404,
    description: SWAGGER_USER_RESPONSES.USER_NOT_FOUND,
  })
  @Get('availability/isUsernameAvailable')
  public async isUsernameAvailable(
    @Query() usernameQuery: UsernameQueryDto,
  ): Promise<string> {
    return (await this.userService.findOneByUsername(usernameQuery.username))
      .username;
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.IS_EMAIL_AVAILABLE })
  @ApiQuery({ name: 'email', type: String })
  @ApiResponse({
    status: 404,
    description: SWAGGER_USER_RESPONSES.USER_NOT_FOUND,
  })
  @Get('availability/isEmailAvailable')
  public async isEmailAvailable(
    @Query() emailQuery: EmailQueryDto,
  ): Promise<string> {
    return (await this.userService.findOneByEmail(emailQuery.email)).email;
  }
}
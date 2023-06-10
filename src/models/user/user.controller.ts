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

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeOrmValidationErrorFilter } from '../../utils/exceptions/type-orm-validation-error.filter';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { UserData } from './decorator/user.decorator';
import {
  SWAGGER_USER_RESPONSES,
  SWAGGER_USER_SUMMARY,
  USER_VISIBILITY_LEVELS,
} from './user.constants';
import PublicFileEntity from '../file/entities/publicFile.entity';
import { FileUploadDto } from './dto/file-upload.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.FETCH_USERS })
  @ApiCreatedResponse({ type: Array<User> })
  @SerializeOptions({ groups: [USER_VISIBILITY_LEVELS.FETCH_USERS] })
  @Get()
  public async fetchUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.FIND_ONE })
  @ApiCreatedResponse({ type: User })
  @SerializeOptions({ groups: [USER_VISIBILITY_LEVELS.FETCH_ONE] })
  @Get(':username')
  public async findOne(@Param('username') username: string): Promise<User> {
    return this.userService.findOneByUsername(username);
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.FETCH_PROFILE })
  @ApiCreatedResponse({ type: User })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @SerializeOptions({
    groups: [USER_VISIBILITY_LEVELS.FETCH_ONE, USER_VISIBILITY_LEVELS.FETCH_ME],
  })
  @Get('profile/me')
  public async fetchProfile(@UserData('userId') userId: string): Promise<User> {
    return this.userService.findOneWithRelations(userId);
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.UPDATE })
  @ApiCreatedResponse({ type: User })
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new TypeOrmValidationErrorFilter())
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
  @ApiResponse({
    status: 404,
    description: SWAGGER_USER_RESPONSES.USER_NOT_FOUND,
  })
  @Get('availability/checkUsername/:username')
  public async isUsernameAvailable(
    @Param('username') username: string,
  ): Promise<string> {
    return (await this.userService.findOneByUsername(username)).username;
  }

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.IS_EMAIL_AVAILABLE })
  @ApiResponse({
    status: 404,
    description: SWAGGER_USER_RESPONSES.USER_NOT_FOUND,
  })
  @Get('availability/checkEmail/:email')
  public async isEmailAvailable(
    @Param('email') email: string,
  ): Promise<string> {
    return (await this.userService.findOneByEmail(email)).email;
  }
}

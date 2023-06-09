import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { SWAGGER_WISH_SUMMARY } from './wish.constants';
import Wish from './entities/wish.entity';
import { FileUploadDto } from '../user/dto/file-upload.dto';
import { UserData } from '../user/decorator/user.decorator';
import PublicFileEntity from '../file/entities/publicFile.entity';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@ApiTags('wishes')
@Controller('wishes')
export class WishController {
  constructor(private readonly wishesService: WishService) {}

  @ApiOperation({ summary: SWAGGER_WISH_SUMMARY.CREATE })
  @ApiCreatedResponse({ type: Wish })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateWishDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':collectionId')
  public async createWish(
    @UserData('userId') userId: string,
    @Param('collectionId') collectionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return this.wishesService.create(
      userId,
      +collectionId,
      file,
      createWishDto,
    );
  }

  @ApiOperation({ summary: SWAGGER_WISH_SUMMARY.FIND_ONE })
  @ApiCreatedResponse({ type: Wish })
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.findOne(+id);
  }

  @ApiOperation({ summary: SWAGGER_WISH_SUMMARY.COLLECTIONS_WISHES })
  @ApiCreatedResponse({ type: Array<Wish> })
  @Get('fromCollection/:collectionId')
  public async findCollectionsWishes(
    @Param('collectionId') collectionId: string,
  ): Promise<Wish[]> {
    return this.wishesService.findCollectionsWishes(+collectionId);
  }

  @ApiOperation({ summary: SWAGGER_WISH_SUMMARY.UPDATE })
  @ApiCreatedResponse({ type: Wish })
  @ApiBody({ type: UpdateWishDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async update(
    @UserData('userId') userId: string,
    @Param('id') wishId: string,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.update(userId, +wishId, updateWishDto);
  }

  @ApiOperation({ summary: SWAGGER_WISH_SUMMARY.UPDATE_IMAGE })
  @ApiCreatedResponse({ type: PublicFileEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id/image')
  public async updateImage(
    @UserData('userId') userId: string,
    @Param('id') wishId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PublicFileEntity> {
    return this.wishesService.addImage(
      userId,
      +wishId,
      file.buffer,
      file.originalname,
    );
  }

  @ApiOperation({ summary: SWAGGER_WISH_SUMMARY.REMOVE })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(
    @UserData('userId') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.wishesService.remove(userId, +id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { RequestWithUser } from '../auth/interface/requestWithUser.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post(':id')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Req() req: RequestWithUser,
    @Param('id') collectionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create(
      req.user.id,
      +collectionId,
      file,
      createWishDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') wishId: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(req.user.id, +wishId, updateWishDto);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Req() req: RequestWithUser,
    @Param('id') wishId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.wishesService.addImage(
      req.user.id,
      +wishId,
      file.buffer,
      file.originalname,
    );
  }

  @Delete(':id')
  async remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.wishesService.remove(req.user.id, +id);
  }
}

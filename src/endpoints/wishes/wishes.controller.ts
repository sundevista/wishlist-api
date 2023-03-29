import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { RequestWithUser } from '../auth/interface/requestWithUser.interface';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post(':id')
  create(
    @Req() req: RequestWithUser,
    @Param('id') collectionId: string,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create(req.user.id, +collectionId, createWishDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wishesService.remove(+id);
  // }
}

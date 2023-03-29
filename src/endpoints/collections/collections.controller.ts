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
import { RequestWithUser } from '../auth/interface/requestWithUser.interface';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    return this.collectionsService.create(req.user.id, createCollectionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(+id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.collectionsService.remove(req.user.id, +id);
  }
}

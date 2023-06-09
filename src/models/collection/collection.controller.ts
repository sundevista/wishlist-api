import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import Collection from './entities/collection.entity';
import { SWAGGER_COLLECTION_SUMMARY } from './collection.constants';
import { UserData } from '../user/decorator/user.decorator';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@ApiTags('collections')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionsService: CollectionService) {}

  @ApiOperation({ summary: SWAGGER_COLLECTION_SUMMARY.CREATE })
  @ApiCreatedResponse({ type: Collection })
  @ApiBody({ type: CreateCollectionDto })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post()
  public async createCollection(
    @UserData('userId') userId: string,
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    return this.collectionsService.create(userId, createCollectionDto);
  }

  @ApiOperation({ summary: SWAGGER_COLLECTION_SUMMARY.FIND_ONE })
  @ApiCreatedResponse({ type: Collection })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Collection> {
    return this.collectionsService.findOneWithChildRelations(+id);
  }

  @ApiOperation({ summary: SWAGGER_COLLECTION_SUMMARY.FETCH_PERSONAL })
  @ApiCreatedResponse({ type: Array<Collection> })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('user/fetchPersonal')
  public async findUsersCollections(
    @UserData('userId') userId: string,
  ): Promise<Collection[]> {
    return this.collectionsService.getAllUsersCollections(userId);
  }

  @ApiOperation({ summary: SWAGGER_COLLECTION_SUMMARY.FETCH_GENERAL })
  @ApiCreatedResponse({ type: Array<Collection> })
  @Get('user/fetchOthers/:username')
  public async findOthersCollection(
    @Param('username') username: string,
  ): Promise<Collection[]> {
    return this.collectionsService.getPublicUsersCollections(username);
  }

  @ApiOperation({ summary: SWAGGER_COLLECTION_SUMMARY.UPDATE })
  @ApiCreatedResponse({ type: Collection })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ): Promise<Collection> {
    return this.collectionsService.update(+id, updateCollectionDto);
  }

  @ApiOperation({ summary: SWAGGER_COLLECTION_SUMMARY.REMOVE })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(
    @UserData('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.collectionsService.remove(userId, +id);
  }
}

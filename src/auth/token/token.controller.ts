import { Body, Controller, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TokenService } from './token.service';
import { UpdateTokenDto } from './dto/token.dto';
import { SWAGGER_TOKEN_SUMMARY } from './token.constants';

@ApiTags('auth/token')
@Controller('auth/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @ApiOperation({ summary: SWAGGER_TOKEN_SUMMARY.UPDATE_ACCESS_TOKEN })
  @ApiBody({ type: UpdateTokenDto })
  @Put('update-access')
  public async updateAccessToken(
    @Body() accessUpdateTokenDto: UpdateTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.tokenService.updateAccessToken(
      accessUpdateTokenDto.refreshToken,
    );
  }

  @ApiOperation({ summary: SWAGGER_TOKEN_SUMMARY.UPDATE_REFRESH_TOKEN })
  @ApiBody({ type: UpdateTokenDto })
  @Put('update-refresh')
  public async updateRefreshToken(
    @Body() refreshUpdateTokenDto: UpdateTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.tokenService.updateRefreshToken(
      refreshUpdateTokenDto.refreshToken,
    );
  }
}

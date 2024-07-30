import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { UserAuthDto } from './dto/user-auth.dto';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() createUserDto: UserAuthDto) {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async me(@Req() req: Request) {
    this.logger.log(req.body);
    return { user: req['user'] };
  }

  @Post('signin')
  signin(@Body() data: UserAuthDto) {
    return this.authService.signin(data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  logout(@Req() req: Request) {
    this.authService.signout(req['user']['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}

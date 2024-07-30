import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserAuthDto } from './dto/user-auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  signin = async (user: UserAuthDto) => {
    try {
      const queriedUser = await this.userService.findByEmail(user.email);
      if (!queriedUser) {
        throw new NotFoundException('No User Registered with this Email');
      }
      if (!(await bcrypt.compare(user.password, queriedUser.password))) {
        throw new BadRequestException('Incorrect Password');
      }
      const tokens = await this.getTokens(queriedUser.id, user.email);
      await this.updateRefreshToken(queriedUser.id, user.email);
      return { ...user, ...tokens };
    } catch (err) {
      return {
        error: err.response,
      };
    }
  };

  signup = async (user: UserAuthDto) => {
    try {
      const existingUser = await this.userService.findByEmail(user.email);
      if (existingUser) {
        throw new BadRequestException('User Already Exists');
      }
      const newUser = await this.userService.create(user);
      const tokens = await this.getTokens(newUser.id, newUser.email);
      return { ...user, ...tokens };
    } catch (err) {
      return {
        error: err.response,
      };
    }
  };

  signout = async (id: string) => {
    try {
      return await this.userService.update(id, { refreshToken: null });
    } catch (err) {
      return {
        error: err.response,
      };
    }
  };

  // :utils
  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '5h',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  validateUser = async (email: string, pass: string) => {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return { ...user, password: null };
    }
    return null;
  };

  refreshTokens = async (userId: string, refreshToken: string) => {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  };

  updateRefreshToken = async (id: string, refreshToken: string) => {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(id, {
      refreshToken: hashedRefreshToken,
    });
  };
}

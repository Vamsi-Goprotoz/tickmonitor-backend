import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      signOptions: {
        expiresIn: 10,
      },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: any) {
    console.log('========> ', {
      ...payload,
      initiated: new Date(payload.iat!).toLocaleTimeString(),
      expiry: new Date(payload.exp!).toLocaleTimeString(),
      diff: new Date(payload.exp!).toLocaleTimeString(),
    });
    return payload;
  }
}

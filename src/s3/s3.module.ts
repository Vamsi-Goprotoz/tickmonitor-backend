import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { S3Service } from './s3.service';
import * as multer from 'multer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module implements NestModule {
  constructor(private readonly s3Service: S3Service) {}
  configure = (consumer: MiddlewareConsumer) => {
    consumer
      .apply(
        multer({ storage: this.s3Service.getMulterS3() }).array('files', 10),
      )
      .forRoutes('/attatchments');
  };
}

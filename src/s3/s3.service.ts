import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as MulterS3 from 'multer-s3';

@Injectable()
export class S3Service {
  private s3: S3Client;
  constructor(private readonly configService: ConfigService) {
    const useLocal = this.configService.get<boolean>('USE_LOCAL');
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: !useLocal
          ? this.configService.get<string>('S3_ACCESS_KEY_ID')
          : 'test',
        secretAccessKey: !useLocal
          ? this.configService.get<string>('S3_SECRET_ACCESS_KEY')
          : 'test',
      },
      endpoint: useLocal ? 'http://localhost:4566' : undefined,
      region: this.configService.get<string>('AWS_REGION'),
    });
    7;
  }

  getMulterS3 = () =>
    MulterS3({
      s3: this.s3,
      bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      acl: 'public-red',
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname, filename: file.filename });
      },
      key: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`);
      },
    });

  async deleteFile(key: string) {
    const params = {
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: key,
    };
    try {
      const command = new DeleteObjectCommand(params);
      await this.s3.send(command);
    } catch (err) {
      throw new Error('Error in AWS Client Delete Command');
    }
  }
}

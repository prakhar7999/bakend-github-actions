import { Injectable } from '@nestjs/common';
import { Endpoint, S3 } from 'aws-sdk';
import { ConfigService } from '../config/config.service';

@Injectable()
export class S3Service {
  public s3: S3;
  constructor(private readonly config: ConfigService) {
    this.s3 = new S3({
      s3ForcePathStyle: true,
      accessKeyId: this.config.get('aws.accessKeyId'),
      secretAccessKey: this.config.get('aws.secretAccessKey'),
      endpoint: new Endpoint(this.config.get('aws.s3.endpoint')),
    });
  }

  putObject(params: S3.PutObjectRequest): Promise<S3.PutObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3.putObject(
        params,
        (error: Error | null, data: S3.PutObjectOutput) => {
          if (error) {
            return reject(error);
          }
          return resolve(data);
        },
      );
    });
  }

  deleteObject(params: S3.DeleteObjectRequest): Promise<S3.DeleteObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        params,
        (error: Error | null, data: S3.DeleteObjectOutput) => {
          if (error) {
            return reject(error);
          }

          return resolve(data);
        },
      );
    });
  }
}

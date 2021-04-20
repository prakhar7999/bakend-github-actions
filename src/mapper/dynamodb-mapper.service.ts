import { DynamoDB } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DynamoDBDataMapperService {
  public client: DynamoDB;
  public mapper: DataMapper;

  constructor(private readonly config: ConfigService) {
    this.client = new DynamoDB({
      region: this.config.get('aws.region'),
      accessKeyId: this.config.get('aws.accessKeyId'),
      secretAccessKey: this.config.get('aws.secretAccessKey'),
      endpoint: this.config.get('dynamodb.endpoint'),
    });

    this.mapper = new DataMapper({ client: this.client });
  }
}

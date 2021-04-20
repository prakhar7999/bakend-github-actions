import { Module } from '@nestjs/common';
import { DynamoDBDataMapperService } from './dynamodb-mapper.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [DynamoDBDataMapperService],
  exports: [DynamoDBDataMapperService],
})
export class DynamoDBDataMapperModule {}

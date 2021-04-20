import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ConfigModule } from '../../config/config.module';
import { DynamoDBDataMapperModule } from '../../mapper/dynamodb-mapper.module';
import { ArtWorkModule } from '../artworks/artwork.module';

@Module({
  imports: [ConfigModule, DynamoDBDataMapperModule, ArtWorkModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}

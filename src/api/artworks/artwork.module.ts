import { Module } from '@nestjs/common';
import { ArtWorkService } from './artwork.service';
import { ArtWorkController } from './artwork.controller';
import { S3Module } from '../../s3/s3.module';
import { ConfigModule } from '../../config/config.module';
import { DynamoDBDataMapperModule } from '../../mapper/dynamodb-mapper.module';
import { GraphModule } from 'src/graph/graph.module';

@Module({
  imports: [S3Module, ConfigModule, DynamoDBDataMapperModule, GraphModule],
  providers: [ArtWorkService],
  controllers: [ArtWorkController],
  exports: [ArtWorkService],
})
export class ArtWorkModule {}

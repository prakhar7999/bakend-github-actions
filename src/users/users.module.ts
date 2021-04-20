import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from './../config/config.module';
import { DynamoDBDataMapperModule } from './../mapper/dynamodb-mapper.module';

@Module({
  imports: [ConfigModule, DynamoDBDataMapperModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

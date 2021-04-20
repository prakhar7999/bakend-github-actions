import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtWorkModule } from './artworks/artwork.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [UsersModule, ArtWorkModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

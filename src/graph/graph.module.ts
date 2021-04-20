import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { GraphService } from './graph.service';

@Module({
  imports: [ConfigModule],
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}

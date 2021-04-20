import { Injectable } from '@nestjs/common';
import { config } from './app.config';

@Injectable()
export class ConfigService {
  // [TODO] fix and replace with proper interface
  private readonly envConfig: any;

  constructor() {
    this.envConfig = config;
  }

  get(key: string): any {
    return this.envConfig.get(key);
  }
}

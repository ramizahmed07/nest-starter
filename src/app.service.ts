import { Injectable } from '@nestjs/common';
import { LoggerService } from './core/logger/logger.service';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  private context = 'AppService';
  constructor(
    private readonly logger: LoggerService,
    private readonly databaseService: DatabaseService,
  ) {}

  async getHello() {
    this.logger.log('Hello World!', this.context, { userId: 34 });
    const users = await this.databaseService.user.findMany();

    console.log('user', users);
    return 'Hello World!';
  }
}

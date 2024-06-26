import { createMock } from '@golevelup/ts-jest';
import { mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';
import { LoggerService } from './core/logger/logger.service';
import { DatabaseService } from './database/database.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: LoggerService,
          useValue: createMock<LoggerService>(),
        },
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const result = await appService.getHello();
      expect(result).toBe('Hello World!');
    });
  });
});

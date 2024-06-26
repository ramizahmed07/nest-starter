import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from 'src/core/logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const environment = this.configService.get(`environment`);
    if (environment === 'test') {
      return next();
    }

    const start = Date.now();
    const { method, url, headers, query, body } = req;

    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const message = `${method} ${url} ${res.statusCode} ${responseTime}ms`;
      const statusCode = res.statusCode;
      const logData = {
        responseTime,
        method,
        url,
        headers,
        query,
        body,
      };

      if (statusCode >= 500) {
        this.loggerService.error(message, undefined, `HTTP`, logData);
      } else if (statusCode >= 400) {
        this.loggerService.warn(message, `HTTP`, logData);
      } else {
        this.loggerService.log(message, `HTTP`, logData);
      }
    });

    next();
  }
}

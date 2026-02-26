import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogsBuffer } from '../admin/logs.buffer';

@Injectable()
export class HttpLogsMiddleware implements NestMiddleware {
  constructor(private readonly logsBuffer: LogsBuffer) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    this.logsBuffer.info(`→ ${method} ${originalUrl}`, {
      method,
      path: originalUrl,
      ip,
    });

    res.on('finish', () => {
      const ms = Date.now() - start;
      const { statusCode } = res;
      const level =
        statusCode >= 500
          ? 'error'
          : statusCode >= 400
            ? 'warn'
            : statusCode >= 300
              ? 'debug'
              : 'success';

      this.logsBuffer.add({
        level,
        message: `← ${method} ${originalUrl} ${statusCode} +${ms}ms`,
        meta: { method, path: originalUrl, statusCode, ms },
      });
    });

    next();
  }
}

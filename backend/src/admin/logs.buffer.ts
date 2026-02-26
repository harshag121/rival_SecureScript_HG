import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'success';
  message: string;
  meta?: Record<string, unknown>;
}

@Injectable()
export class LogsBuffer {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 500;
  readonly subject = new Subject<LogEntry>();

  add(entry: Omit<LogEntry, 'timestamp'>): void {
    const log: LogEntry = { ...entry, timestamp: new Date().toISOString() };
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    this.subject.next(log);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.add({ level: 'info', message, meta });
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.add({ level: 'warn', message, meta });
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.add({ level: 'error', message, meta });
  }

  success(message: string, meta?: Record<string, unknown>): void {
    this.add({ level: 'success', message, meta });
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.add({ level: 'debug', message, meta });
  }

  getRecent(): LogEntry[] {
    return [...this.logs];
  }
}

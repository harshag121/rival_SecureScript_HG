import { Controller, Get, MessageEvent, Sse } from '@nestjs/common';
import { Observable, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Public } from '../auth/decorators/public.decorator';
import { LogsBuffer } from './logs.buffer';

@Controller('admin')
export class AdminController {
  constructor(private readonly logsBuffer: LogsBuffer) {}

  /**
   * SSE endpoint — streams recent + live log entries.
   * Accessible at GET /api/admin/logs
   * @Public so it works without auth for dev convenience
   */
  @Public()
  @Sse('logs')
  streamLogs(): Observable<MessageEvent> {
    const recent = this.logsBuffer.getRecent();

    // replay buffered logs first, then live ones
    const past$ = of(...recent).pipe(
      map((log) => ({ data: JSON.stringify(log) }) as MessageEvent),
    );

    const live$ = this.logsBuffer.subject.pipe(
      map((log) => ({ data: JSON.stringify(log) }) as MessageEvent),
    );

    return merge(past$, live$);
  }
}

import { LogsBuffer } from './logs.buffer';
import { describe, expect, it } from '@jest/globals';

describe('LogsBuffer', () => {
  it('stores and returns recent logs', () => {
    const buffer = new LogsBuffer();

    buffer.info('hello');
    buffer.error('oops', { code: 500 });

    const logs = buffer.getRecent();
    expect(logs).toHaveLength(2);
    expect(logs[0].level).toBe('info');
    expect(logs[1].level).toBe('error');
    expect(logs[1].meta).toEqual({ code: 500 });
  });
});

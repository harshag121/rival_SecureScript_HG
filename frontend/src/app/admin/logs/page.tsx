'use client';

import { useState, useEffect, useRef } from 'react';
import { PageShell } from '@/components/layout/PageShell';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'success';
  message: string;
  meta?: Record<string, unknown>;
}

const LEVEL_CLASSES: Record<LogEntry['level'], string> = {
  info: 'log-info',
  warn: 'log-warn',
  error: 'log-error',
  debug: 'log-debug',
  success: 'log-success',
};

const LEVEL_TAG: Record<LogEntry['level'], string> = {
  info: 'INFO ',
  warn: 'WARN ',
  error: 'ERR  ',
  debug: 'DBG  ',
  success: 'OK   ',
};

function fmt(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      + '.' + String(d.getMilliseconds()).padStart(3, '0');
  } catch {
    return ts;
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [search, setSearch] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const pendingRef = useRef<LogEntry[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const es = new EventSource(`${API}/admin/logs`);
    esRef.current = es;

    es.onopen = () => setIsConnected(true);

    es.onmessage = (e) => {
      try {
        const entry = JSON.parse(e.data) as LogEntry;
        if (pausedRef.current) {
          pendingRef.current.push(entry);
        } else {
          setLogs((prev) => [...prev.slice(-999), entry]);
        }
      } catch {}
    };

    es.onerror = () => setIsConnected(false);

    return () => {
      es.close();
    };
  }, []);

  useEffect(() => {
    pausedRef.current = isPaused;
    if (!isPaused && pendingRef.current.length > 0) {
      setLogs((prev) => [...prev, ...pendingRef.current].slice(-999));
      pendingRef.current = [];
    }
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  const visible = logs.filter((l) => {
    if (filter !== 'all' && l.level !== filter) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = logs.reduce(
    (acc, l) => { acc[l.level] = (acc[l.level] || 0) + 1; return acc; },
    {} as Record<string, number>,
  );

  return (
      <PageShell className="bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Live Logs</h1>
            <p className="text-sm text-neutral-400 mt-0.5">
              Real-time stream from backend · {logs.length} entries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <button
              onClick={() => setIsPaused((p) => !p)}
              className={isPaused ? 'btn-primary text-sm' : 'btn-secondary text-sm'}
            >
              {isPaused ? `▶ Resume (${pendingRef.current.length})` : '⏸ Pause'}
            </button>
            <button onClick={() => setLogs([])} className="btn-ghost text-sm text-red-500">
              Clear
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Search messages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field text-sm py-1.5 max-w-xs"
          />
          <div className="flex gap-1.5">
            {(['all', 'success', 'info', 'warn', 'error', 'debug'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  filter === lvl
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {lvl === 'all' ? `All (${logs.length})` : `${lvl} (${counts[lvl] || 0})`}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div
          className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800"
          style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}
        >
          {/* Terminal titlebar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs text-neutral-500 font-mono">secureblog · admin/logs</span>
          </div>

          <div className="overflow-y-auto h-full p-4 font-mono text-xs leading-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
            {visible.length === 0 ? (
              <p className="text-neutral-600 mt-8 text-center">
                {isConnected ? 'Waiting for log entries…' : 'Not connected. Check if backend is running.'}
              </p>
            ) : (
              visible.map((log, i) => (
                <div key={i} className={`flex gap-3 ${LEVEL_CLASSES[log.level]}`}>
                  <span className="text-neutral-600 flex-shrink-0 select-none">{fmt(log.timestamp)}</span>
                  <span className="flex-shrink-0 font-bold select-none">{LEVEL_TAG[log.level]}</span>
                  <span className="break-all">{log.message}</span>
                  {log.meta && Object.keys(log.meta).length > 0 && (
                    <span className="text-neutral-600 ml-1 flex-shrink-0">
                      {JSON.stringify(log.meta)}
                    </span>
                  )}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

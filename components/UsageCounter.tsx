'use client';
import { useState, useEffect } from 'react';

const MAX_FREE = 3;

export function UsageCounter() {
  const [remaining, setRemaining] = useState(MAX_FREE);

  useEffect(() => {
    fetch('/api/auth/status')
      .then(r => r.json())
      .then(d => { if (d.remaining !== undefined && d.remaining !== null) setRemaining(d.remaining); })
      .catch(() => {});
  }, []);

  const used = MAX_FREE - remaining;
  const pct = Math.min(100, (used / MAX_FREE) * 100);

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm" role="status" aria-label={`無料残り${remaining}回`}>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-xs opacity-70">無料利用</span>
          <span className="text-xs font-bold">{remaining}/{MAX_FREE}回</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${100 - pct}%`,
              backgroundColor: remaining === 0 ? '#EF4444' : remaining === 1 ? '#F59E0B' : '#10B981',
            }}
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { PMAgentRun, PMAgentRunListResponse, HoldingEval, ResearchResult, BuyCandidate, BuyExecuted } from '../types';

const DECISION_STYLE: Record<string, string> = {
  BUY:  'bg-green-100 text-green-700',
  SELL: 'bg-red-100 text-red-600',
  HOLD: 'bg-yellow-100 text-yellow-700',
  WAIT: 'bg-gray-100 text-gray-500',
};

const REC_STYLE: Record<string, string> = {
  BUY:  'bg-green-100 text-green-700',
  SELL: 'bg-red-100 text-red-600',
  HOLD: 'bg-yellow-100 text-yellow-700',
  WAIT: 'bg-gray-100 text-gray-500',
};

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</span>
      {count != null && (
        <span className="text-xs text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded-full">{count}</span>
      )}
    </div>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DECISION_STYLE[decision] ?? 'bg-gray-100 text-gray-500'}`}>
      {decision}
    </span>
  );
}

function ConditionPills({ conditions }: { conditions: Record<string, string> }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(conditions).map(([k, v]) => (
        <span
          key={k}
          className={`text-xs px-2 py-0.5 rounded-full border ${v === 'MET' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
        >
          {k}: {v}
        </span>
      ))}
    </div>
  );
}

function HoldingEvalSection({ evals }: { evals: HoldingEval[] }) {
  if (evals.length === 0) return null;
  return (
    <div>
      <SectionHeader title="Holding Evaluations" count={evals.length} />
      <div className="divide-y divide-gray-50">
        {evals.map((e) => (
          <div key={e.holding_id} className="px-4 py-3 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-gray-900">{e.ticker}</span>
                <span className="text-xs text-gray-400 font-mono">{e.setup_name}</span>
                <span className={`text-xs font-semibold ${e.pnl_pct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {e.pnl_pct >= 0 ? '+' : ''}{e.pnl_pct.toFixed(2)}%
                </span>
              </div>
              {e.reason && <p className="text-xs text-gray-500 leading-snug">{e.reason}</p>}
              {e.conditions && Object.keys(e.conditions).length > 0 && (
                <ConditionPills conditions={e.conditions} />
              )}
              {e.order && (
                <p className="text-xs text-gray-400 mt-1">
                  Filled {e.order.filled_qty.toFixed(4)} @ {fmt(e.order.filled_avg_price)}
                </p>
              )}
            </div>
            <DecisionBadge decision={e.decision} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ResearchSection({ results }: { results: ResearchResult[] }) {
  if (results.length === 0) return null;
  return (
    <div>
      <SectionHeader title="News Based Research" count={results.length} />
      <div className="divide-y divide-gray-50">
        {results.map((r) => (
          <div key={r.ticker} className="px-4 py-3 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold text-gray-900 block mb-0.5">{r.ticker}</span>
              <p className="text-xs text-gray-500 leading-snug whitespace-pre-wrap">{r.reason}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${REC_STYLE[r.recommendation] ?? 'bg-gray-100 text-gray-500'}`}>
              {r.recommendation}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuyCandidatesSection({ candidates, executed }: { candidates: BuyCandidate[]; executed: BuyExecuted[] }) {
  if (candidates.length === 0) return null;
  const execMap = Object.fromEntries(executed.map((b) => [b.ticker, b]));
  return (
    <div>
      <SectionHeader title="Buy Candidates" count={candidates.length} />
      <div className="divide-y divide-gray-50">
        {candidates.map((c) => {
          const exec = execMap[c.ticker];
          return (
            <div key={c.ticker} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{c.ticker}</span>
                  <span className="text-xs text-gray-400 font-mono">{c.setup_name}</span>
                </div>
                {exec ? (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {exec.order.status}
                  </span>
                ) : (
                  <DecisionBadge decision={c.decision} />
                )}
              </div>
              {c.conditions && Object.keys(c.conditions).length > 0 && (
                <ConditionPills conditions={c.conditions} />
              )}
              {exec && (
                <p className="text-xs text-gray-500 mt-1.5">
                  Filled {exec.order.filled_qty.toFixed(4)} shares @ {fmt(exec.order.filled_avg_price)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RunCard({ run }: { run: PMAgentRun }) {
  const [open, setOpen] = useState(false);
  const { summary_json: sj } = run;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Summary header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">{fmtDate(run.run_at)}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-500">Sim date: <span className="font-medium text-gray-700">{run.sim_date}</span></span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { label: 'Evaluated',     value: run.holdings_evaluated },
            { label: 'Sells',         value: run.sells_executed,    color: run.sells_executed > 0 ? 'text-red-600' : undefined },
            { label: 'Buys',          value: run.buys_executed,     color: run.buys_executed > 0 ? 'text-green-600' : undefined },
            { label: 'Open',          value: run.open_holdings_count },
            { label: 'Elapsed',       value: `${run.elapsed_seconds}s` },
          ].map(({ label, value, color }) => (
            <span key={label} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              <span className="text-gray-400">{label}</span>
              <span className={`font-semibold text-gray-800 ${color ?? ''}`}>{value}</span>
            </span>
          ))}
        </div>

        {/* Summary text preview when collapsed */}
        {!open && run.summary_text && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-2 text-left">{run.summary_text.trim()}</p>
        )}
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {/* Full summary text */}
          {run.summary_text && (
            <div className="px-4 py-3">
              <pre className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed font-sans">
                {run.summary_text.trim()}
              </pre>
            </div>
          )}

          <HoldingEvalSection evals={sj.holdings_eval ?? []} />
          <ResearchSection results={sj.research_results ?? []} />
          <BuyCandidatesSection candidates={sj.buy_candidates ?? []} executed={sj.buys_executed ?? []} />
        </div>
      )}
    </div>
  );
}

interface Props {
  data: PMAgentRunListResponse;
}

export function PMAgentRunListCard({ data }: Props) {
  const { account_name, account_id, count, runs } = data;

  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <span className="text-sm font-bold text-gray-900">Agent Runs</span>
          <span className="text-xs text-gray-400 ml-2">{account_name ?? account_id}</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {count} run{count !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2">
        {runs.map((run) => (
          <RunCard key={run.id} run={run} />
        ))}
      </div>
    </div>
  );
}

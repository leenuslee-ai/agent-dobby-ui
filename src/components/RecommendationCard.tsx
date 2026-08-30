import type { RecommendationResponse } from '../types';

interface Props {
  data: RecommendationResponse;
}

const BADGE: Record<string, { bg: string; text: string; border: string }> = {
  BUY:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  SELL: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'   },
  HOLD: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
};

function BoolBadge({ value, label }: { value: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
        {value ? 'Yes' : 'No'}
      </span>
    </div>
  );
}

function NumStat({ label, value, unit = '' }: { label: string; value: number; unit?: string }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-3 min-w-[80px]">
      <span className="text-base font-bold text-gray-900">{value.toFixed(1)}{unit}</span>
      <span className="text-xs text-gray-400 mt-0.5 text-center">{label}</span>
    </div>
  );
}

export function RecommendationCard({ data }: Props) {
  const { ticker, recommendation, reason, indicators } = data;
  const badge = BADGE[recommendation] ?? BADGE.HOLD;

  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{ticker}</span>
          <span className="text-xs text-gray-400">Recommendation</span>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
          {recommendation}
        </span>
      </div>

      {/* Reason */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
      </div>

      {/* Indicators */}
      <div className="px-4 py-3">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Indicators</div>

        {/* Numeric stats */}
        <div className="flex flex-wrap gap-2 mb-3">
          {indicators.rsi     != null && <NumStat label="RSI" value={indicators.rsi} />}
          {indicators.adx     != null && <NumStat label="ADX" value={indicators.adx} />}
          {indicators.bb_pct  != null && <NumStat label="BB %" value={indicators.bb_pct * 100} unit="%" />}
        </div>

        {/* Boolean flags */}
        <div className="divide-y divide-gray-50">
          {indicators.above_sma50   != null && <BoolBadge label="Above SMA-50"   value={indicators.above_sma50} />}
          {indicators.above_sma200  != null && <BoolBadge label="Above SMA-200"  value={indicators.above_sma200} />}
          {indicators.ema20_rising  != null && <BoolBadge label="EMA-20 Rising"  value={indicators.ema20_rising} />}
          {indicators.macd_cross_up != null && <BoolBadge label="MACD Cross Up"  value={indicators.macd_cross_up} />}
        </div>
      </div>
    </div>
  );
}

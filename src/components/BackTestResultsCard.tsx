import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts';
import type { BackTestResultsResponse } from '../types';

interface Props {
  data: BackTestResultsResponse;
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: 'green' | 'red' | 'neutral';
}) {
  const color =
    highlight === 'green'
      ? 'text-green-600'
      : highlight === 'red'
      ? 'text-red-500'
      : 'text-gray-900';
  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-3 min-w-[90px]">
      <span className={`text-base font-bold ${color}`}>{value}</span>
      <span className="text-xs text-gray-400 mt-0.5 text-center leading-tight">{label}</span>
    </div>
  );
}

export function BackTestResultsCard({ data }: Props) {
  const { summary, trades, candle_data } = data;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!candle_data || candle_data.length === 0) return;
    const el = containerRef.current;
    if (!el) return;

    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#374151',
      },
      grid: {
        vertLines: { color: '#f3f4f6' },
        horzLines: { color: '#f3f4f6' },
      },
      width: el.clientWidth,
      height: 300,
      timeScale: { borderColor: '#e5e7eb' },
      rightPriceScale: { borderColor: '#e5e7eb' },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    series.setData(
      candle_data.map((bar) => ({
        time: bar.date,
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
      }))
    );

    const markers = trades.flatMap((trade) => [
      {
        time: trade.entry_date,
        position: 'belowBar' as const,
        color: '#22c55e',
        shape: 'arrowUp' as const,
        text: `Buy $${trade.entry_price.toFixed(2)}`,
        size: 1,
      },
      {
        time: trade.exit_date,
        position: 'aboveBar' as const,
        color: '#ef4444',
        shape: 'arrowDown' as const,
        text: `Sell $${trade.exit_price.toFixed(2)}`,
        size: 1,
      },
    ]);

    markers.sort((a, b) => (a.time < b.time ? -1 : 1));
    createSeriesMarkers(series, markers);

    chart.timeScale().fitContent();

    const observer = new ResizeObserver(() => {
      chart.applyOptions({ width: el.clientWidth });
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [candle_data, trades]);

  const returnPositive = summary.total_return_pct >= 0;

  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <span className="text-sm font-bold text-gray-900">{summary.ticker}</span>
          <span className="text-xs text-gray-500 ml-2">{summary.setup}</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {summary.period}
        </span>
      </div>

      {/* Equity row */}
      <div className="flex gap-3 px-4 py-3 border-b border-gray-100 text-xs text-gray-500">
        <span>Initial: <span className="font-semibold text-gray-800">${summary.initial_equity.toLocaleString()}</span></span>
        <span>Final: <span className="font-semibold text-gray-800">${summary.final_equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
      </div>

      {/* Summary stats */}
      <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-gray-100">
        <StatBox label="Total Return" value={`${returnPositive ? '+' : ''}${summary.total_return_pct.toFixed(2)}%`} highlight={returnPositive ? 'green' : 'red'} />
        <StatBox label="Win Rate" value={`${summary.win_rate_pct.toFixed(1)}%`} highlight={summary.win_rate_pct >= 50 ? 'green' : 'red'} />
        <StatBox label="Trades" value={String(summary.total_trades)} highlight="neutral" />
        <StatBox label="Avg Win" value={`+${summary.avg_win_pct.toFixed(2)}%`} highlight="green" />
        <StatBox label="Avg Loss" value={`${summary.avg_loss_pct.toFixed(2)}%`} highlight="red" />
        <StatBox label="Best Trade" value={`+${summary.best_trade_pct.toFixed(2)}%`} highlight="green" />
        <StatBox label="Worst Trade" value={`${summary.worst_trade_pct.toFixed(2)}%`} highlight="red" />
        <StatBox label="Max Drawdown" value={`${summary.max_drawdown_pct.toFixed(2)}%`} highlight="red" />
        <StatBox label="Sharpe" value={summary.sharpe_ratio.toFixed(2)} highlight={summary.sharpe_ratio >= 1 ? 'green' : 'neutral'} />
      </div>

      {/* Chart — only shown when candle data is provided */}
      {candle_data && candle_data.length > 0 && (
        <div ref={containerRef} className="w-full" />
      )}

      {/* Trades table */}
      {trades.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Trades
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left px-4 py-2 font-medium">Entry Date</th>
                  <th className="text-right px-4 py-2 font-medium">Entry Price</th>
                  <th className="text-left px-4 py-2 font-medium">Exit Date</th>
                  <th className="text-right px-4 py-2 font-medium">Exit Price</th>
                  <th className="text-right px-4 py-2 font-medium">P&L</th>
                  <th className="text-left px-4 py-2 font-medium">Exit Reason</th>
                  <th className="text-center px-4 py-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-gray-700">{trade.entry_date}</td>
                    <td className="px-4 py-2 text-right text-gray-700">${trade.entry_price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-gray-700">{trade.exit_date}</td>
                    <td className="px-4 py-2 text-right text-gray-700">${trade.exit_price.toFixed(2)}</td>
                    <td className={`px-4 py-2 text-right font-semibold ${trade.pnl_pct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {trade.pnl_pct >= 0 ? '+' : ''}{trade.pnl_pct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 text-gray-500">{trade.exit_reason}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${trade.result === 'win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {trade.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

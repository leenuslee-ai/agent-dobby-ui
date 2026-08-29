import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { CandlebarResponse } from '../types';

interface Props {
  data: CandlebarResponse;
}

export function CandlebarChart({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      height: 280,
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
      data.bars.map((bar) => ({
        time: bar.date,
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
      }))
    );

    chart.timeScale().fitContent();

    const observer = new ResizeObserver(() => {
      chart.applyOptions({ width: el.clientWidth });
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [data]);

  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{data.ticker}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {data.time_interval} · {data.days}d
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-green-500 inline-block" /> Up
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-red-500 inline-block" /> Down
          </span>
        </div>
      </div>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}

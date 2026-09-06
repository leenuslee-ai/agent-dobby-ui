import type { TradeListResponse } from '../types';

interface Props {
  data: TradeListResponse;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtPrice(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function TradeListCard({ data }: Props) {
  const { account_name, count, trades } = data;

  const dates = trades.map((t) => t.filled_at).sort();
  const from = dates.length > 0 ? fmtDate(dates[0]) : '';
  const to   = dates.length > 0 ? fmtDate(dates[dates.length - 1]) : '';
  const dateRange = from === to ? from : `${from} – ${to}`;

  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <span className="text-sm font-bold text-gray-900">{account_name}</span>
          <span className="text-xs text-gray-400 ml-2">{dateRange}</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {count} trade{count !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100">
              <th className="text-left px-3 py-2 font-medium">Ticker</th>
              <th className="text-left px-3 py-2 font-medium">Setup</th>
              <th className="text-left px-3 py-2 font-medium">Date</th>
              <th className="text-center px-3 py-2 font-medium">Side</th>
              <th className="text-right px-3 py-2 font-medium">Qty</th>
              <th className="text-right px-3 py-2 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 font-semibold text-gray-900">{t.ticker}</td>
                <td className="px-3 py-2 text-gray-500 font-mono">{t.setup_name}</td>
                <td className="px-3 py-2 text-gray-600">{fmtDate(t.filled_at)}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${t.side === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {t.side}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-gray-700">{t.qty.toFixed(4)}</td>
                <td className="px-3 py-2 text-right text-gray-700">{fmtPrice(t.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

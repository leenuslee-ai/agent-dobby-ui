import type { Holding, HoldingListResponse, OpenHoldingListResponse } from '../types';

interface Props {
  data: HoldingListResponse | OpenHoldingListResponse;
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  if (holdings.length === 0) return null;

  const rows = holdings.map((h) => {
    const cost = h.open_qty * h.open_price;
    const pnl = h.current_open_value - cost;
    return { h, cost, pnl };
  });

  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const totalValue = rows.reduce((s, r) => s + r.h.current_open_value, 0);
  const totalPnl = rows.reduce((s, r) => s + r.pnl, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 border-b border-gray-100">
            <th className="text-left px-3 py-2 font-medium">Ticker</th>
            <th className="text-left px-3 py-2 font-medium">Setup</th>
            <th className="text-left px-3 py-2 font-medium">Open Date</th>
            <th className="text-right px-3 py-2 font-medium">Open Qty</th>
            <th className="text-right px-3 py-2 font-medium">Cost</th>
            <th className="text-right px-3 py-2 font-medium">Current Price</th>
            <th className="text-right px-3 py-2 font-medium">Current Qty</th>
            <th className="text-right px-3 py-2 font-medium">Current Value</th>
            <th className="text-right px-3 py-2 font-medium">P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ h, cost, pnl }) => (
            <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2 font-semibold text-gray-900">{h.ticker}</td>
              <td className="px-3 py-2 text-gray-500 font-mono">{h.setup_name}</td>
              <td className="px-3 py-2 text-gray-600">{fmtDate(h.opening_transaction_date)}</td>
              <td className="px-3 py-2 text-right text-gray-700">{h.open_qty.toFixed(4)}</td>
              <td className={`px-3 py-2 text-right font-medium ${h.opening_transaction_type === 'SELL' ? 'text-red-500' : 'text-gray-700'}`}>
                {fmt(cost)}
              </td>
              <td className="px-3 py-2 text-right text-gray-700">{fmt(h.current_price)}</td>
              <td className="px-3 py-2 text-right text-gray-700">{h.pending_qty.toFixed(4)}</td>
              <td className="px-3 py-2 text-right text-gray-700">{fmt(h.current_open_value)}</td>
              <td className={`px-3 py-2 text-right font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {pnl >= 0 ? '+' : ''}{fmt(pnl)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold">
            <td colSpan={4} className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide">
              Total · {holdings.length} position{holdings.length !== 1 ? 's' : ''}
            </td>
            <td className="px-3 py-2 text-right text-xs text-gray-800">{fmt(totalCost)}</td>
            <td className="px-3 py-2" />
            <td className="px-3 py-2" />
            <td className="px-3 py-2 text-right text-xs text-gray-800">{fmt(totalValue)}</td>
            <td className={`px-3 py-2 text-right text-xs font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {totalPnl >= 0 ? '+' : ''}{fmt(totalPnl)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function HoldingListCard({ data }: Props) {
  const { account_name, holdings } = data;
  const prefix = data.responseType === 'OpenHoldingList' ? 'Current' : 'All';

  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-900">
          {prefix} Holdings for Account {account_name}
        </span>
      </div>

      <HoldingsTable holdings={holdings} />
    </div>
  );
}

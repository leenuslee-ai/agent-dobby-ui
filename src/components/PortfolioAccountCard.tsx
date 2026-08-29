import type { PortfolioAccount, PortfolioAccountResponse } from '../types';

function fmt(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function AccountRow({ account }: { account: PortfolioAccount }) {
  return (
    <div className="px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase shrink-0">
            {account.broker.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{account.display_name}</span>
              {account.is_paper && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                  Paper
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 font-mono">{account.id}</div>
          </div>
        </div>
        <div className="text-xs text-gray-400 shrink-0">{account.account_id}</div>
      </div>

      <div className="flex gap-4 mt-2 ml-12">
        <div>
          <div className="text-xs text-gray-400">Cash</div>
          <div className="text-sm font-semibold text-gray-800">{fmt(account.cash)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Equity</div>
          <div className="text-sm font-semibold text-gray-800">{fmt(account.equity)}</div>
        </div>
        {account.created_at && (
          <div>
            <div className="text-xs text-gray-400">Created</div>
            <div className="text-sm text-gray-600">{formatDate(account.created_at)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function SingleAccountCard({ account }: { account: PortfolioAccountResponse }) {
  const STATUS_STYLES: Record<string, string> = {
    already_exists: 'bg-yellow-100 text-yellow-700',
    created: 'bg-green-100 text-green-700',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-500',
  };
  const statusStyle = STATUS_STYLES[account.status] ?? 'bg-gray-100 text-gray-500';

  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-indigo-500">
            <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H5.25Zm7.5 7.5a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75Zm0-4.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
          </svg>
          <span className="text-sm font-semibold text-gray-900">Portfolio Account</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle}`}>
          {account.status.replace(/_/g, ' ')}
        </span>
      </div>
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase shrink-0">
            {account.broker.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{account.display_name}</span>
              {account.is_paper && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">Paper</span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 font-mono">{account.id}</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">Account ID: <span className="font-mono text-gray-700">{account.account_id}</span></div>
      </div>
    </div>
  );
}

export function PortfolioAccountListCard({ accounts, total }: { accounts: PortfolioAccount[]; total: number }) {
  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-indigo-500">
            <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H5.25Zm7.5 7.5a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75Zm0-4.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
          </svg>
          <span className="text-sm font-semibold text-gray-900">Portfolio Accounts</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {total} account{total !== 1 ? 's' : ''}
        </span>
      </div>
      <div>
        {accounts.map((account) => (
          <AccountRow key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}

export { SingleAccountCard };

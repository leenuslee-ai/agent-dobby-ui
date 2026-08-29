export interface CandleBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CandlebarResponse {
  responseType: 'Candlebar data';
  ticker: string;
  time_interval: string;
  days: number;
  bars: CandleBar[];
}

export interface BackTestSummary {
  ticker: string;
  setup: string;
  days_tested: number;
  total_trades: number;
  wins: number;
  losses: number;
  win_rate_pct: number;
  total_pnl_pct: number;
  avg_win_pct: number;
  avg_loss_pct: number;
}

export interface BackTestTrade {
  entry_date: string;
  entry_price: number;
  exit_date: string;
  exit_price: number;
  pnl_pct: number;
  result: 'win' | 'loss';
}

export interface BackTestResultsResponse {
  responseType: 'BackTestResults';
  summary: BackTestSummary;
  trades: BackTestTrade[];
  candle_data: CandleBar[];
}

export interface PortfolioAccount {
  id: string;
  broker: string;
  account_id: string;
  display_name: string;
  is_paper: boolean;
  cash: number;
  equity: number;
  created_at: string;
}

export interface PortfolioAccountResponse {
  responseType: 'PortfolioAccount';
  status: string;
  id: string;
  broker: string;
  account_id: string;
  display_name: string;
  is_paper: boolean;
  cash?: number;
  equity?: number;
  created_at?: string;
}

export interface PortfolioAccountListResponse {
  responseType: 'PortfolioAccountList';
  accounts: PortfolioAccount[];
  total: number;
}

export type StructuredResponse = CandlebarResponse | BackTestResultsResponse | PortfolioAccountResponse | PortfolioAccountListResponse;

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: StructuredResponse;
}

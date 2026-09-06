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
  period: string;
  initial_equity: number;
  final_equity: number;
  total_return_pct: number;
  total_trades: number;
  win_rate_pct: number;
  avg_win_pct: number;
  avg_loss_pct: number;
  best_trade_pct: number;
  worst_trade_pct: number;
  max_drawdown_pct: number;
  sharpe_ratio: number;
}

export interface BackTestTrade {
  entry_date: string;
  entry_price: number;
  exit_date: string;
  exit_price: number;
  pnl_pct: number;
  exit_reason: string;
  result: 'win' | 'loss';
}

export interface BackTestResultsResponse {
  responseType: 'BackTestResults';
  summary: BackTestSummary;
  trades: BackTestTrade[];
  candle_data?: CandleBar[];
}

export interface HoldingEval {
  holding_id: string;
  ticker: string;
  setup_name: string;
  pending_qty: number;
  open_price: number;
  current_price: number;
  pnl_pct: number;
  decision: 'BUY' | 'SELL' | 'HOLD' | 'WAIT';
  conditions: Record<string, string>;
  reason: string;
  evaluated_at: string;
  order?: {
    order_id: string;
    status: string;
    filled_qty: number;
    filled_avg_price: number;
    filled_at: string;
  };
}

export interface ResearchResult {
  ticker: string;
  recommendation: string;
  reason: string;
}

export interface BuyCandidate {
  ticker: string;
  setup_name: string;
  decision: string;
  risk_percent: number;
  conditions: Record<string, string>;
  reason: string;
  evaluated_at: string;
}

export interface BuyExecuted {
  ticker: string;
  setup_name: string;
  order: {
    order_id: string;
    status: string;
    filled_qty: number;
    filled_avg_price: number;
    filled_at: string;
  };
}

export interface PMAgentRunSummaryJson {
  holdings_eval: HoldingEval[];
  research_results: ResearchResult[];
  buy_candidates: BuyCandidate[];
  buys_executed: BuyExecuted[];
  elapsed_seconds: number;
  errors: unknown[];
}

export interface PMAgentRun {
  id: string;
  account_id: string;
  run_at: string;
  sim_date: string;
  elapsed_seconds: number;
  holdings_evaluated: number;
  sells_executed: number;
  buys_executed: number;
  open_holdings_count: number;
  summary_text: string;
  summary_json: PMAgentRunSummaryJson;
  errors: unknown | null;
  created_at: string;
}

export interface Trade {
  id: string;
  account_id: string;
  ticker: string;
  setup_name: string;
  side: 'BUY' | 'SELL';
  open_close: string;
  qty: number;
  price: number;
  status: string;
  filled_at: string;
  broker_order_id: string;
}

export interface TradeListResponse {
  responseType: 'TradeList';
  account_id: string;
  account_name: string;
  count: number;
  trades: Trade[];
}

export interface PMAgentRunListResponse {
  responseType: 'PMAgentRunList';
  account_id: string;
  account_name?: string;
  count: number;
  runs: PMAgentRun[];
}

export interface Holding {
  id: string;
  account_id: string;
  ticker: string;
  setup_name: string;
  opening_transaction_date: string;
  open_qty: number;
  opening_transaction_type: 'BUY' | 'SELL';
  open_price: number;
  pending_qty: number;
  current_price: number;
  current_open_value: number;
  closed_value: number;
}

export interface HoldingListResponse {
  responseType: 'HoldingList';
  account_id: string;
  account_name: string;
  count: number;
  holdings: Holding[];
}

export interface OpenHoldingListResponse {
  responseType: 'OpenHoldingList';
  account_id: string;
  account_name: string;
  count: number;
  holdings: Holding[];
}

export interface RecommendationIndicators {
  rsi?: number;
  adx?: number;
  bb_pct?: number;
  above_sma50?: boolean;
  above_sma200?: boolean;
  ema20_rising?: boolean;
  macd_cross_up?: boolean;
}

export interface RecommendationResponse {
  responseType: 'Recommendation';
  ticker: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  reason: string;
  indicators: RecommendationIndicators;
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

export type StructuredResponse = CandlebarResponse | BackTestResultsResponse | RecommendationResponse | HoldingListResponse | OpenHoldingListResponse | PMAgentRunListResponse | TradeListResponse | PortfolioAccountResponse | PortfolioAccountListResponse;

export type TraceStep =
  | { step: 'user';        content: string }
  | { step: 'assistant';   content: string }
  | { step: 'tool_call';   tool: string; args: Record<string, unknown> }
  | { step: 'tool_result'; tool: string; content: unknown };

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: StructuredResponse;
  trace?: TraceStep[];
}

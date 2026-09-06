# Agent Dobby — Chat Stories

## General Requests

### Setup Management
- Add a setup:
  ```json
  {
    "name": "RSI_MACD_TREND",
    "description": "Enter when RSI is oversold and MACD crosses up above its signal line, confirming an uptrend via SMA-50 and a trending market via ADX > 20.",
    "definition": {
      "entry_conditions": [
        { "label": "RSI(14) < 35 (oversold)",        "type": "rsi_below",         "params": { "value": 35 } },
        { "label": "MACD crossover up",               "type": "macd_crossover_up", "params": {} },
        { "label": "Price above SMA(50)",             "type": "price_above_sma",   "params": { "period": 50 } },
        { "label": "ADX(14) > 20 (trending market)",  "type": "adx_above",         "params": { "value": 20 } }
      ],
      "exit_conditions": [
        { "label": "RSI(14) > 70 (overbought)", "type": "rsi_above",          "params": { "value": 70 } },
        { "label": "MACD crossover down",        "type": "macd_crossover_down","params": {} }
      ],
      "stop_loss_pct":   0.05,
      "take_profit_pct": 0.15,
      "position_type":   "equity_pct",
      "position_value":  0.10
    }
  }
  ```
- Save a setup called **EMA8_21_PB**: entry when price above SMA-50, EMA-8 above EMA-21, touched EMA-8, closed above EMA-8, ADX above 20. Exit when price below EMA-21 or RSI above 75. Stop loss 4%, take profit 10%, risk 2% of equity.
- View / Show setup `RSI_MACD_TREND`

### Backtesting
- Run a backtest for AAPL over the last 300 days using the `RSI14_Below30` setup and show me the results.
- Run a backtest on NVDA using `RSI_MACD_TREND` setup for 100 days _(not working)_
- List the backtest runs
- Show the backtest result for id = `<id>`

### Watch List
- Add stock to watch list
- Add setup to watch list for stock
- Show the watch list

### Account Management
- Add account:
  | Field | Description |
  |---|---|
  | `broker` | Broker name (e.g. `alpaca`, `td_ameritrade`) |
  | `account_id` | The broker-assigned account identifier |
  | `display_name` | Optional friendly label for this account |
  | `is_paper` | `true` for paper/simulated trading, `false` for live (default `true`) |
  | `cash` | Starting cash balance (default `0.0`) |
  | `equity` | Starting equity value (default `0.0`) |
- List accounts

---

## Account-Specific Requests

| Prompt | Description |
|---|---|
| Portfolio details / view | Current Holdings / Historical |
| What is happening | PortfolioManagerAgent logs |
| News about current holdings | Latest news for held tickers |
| `List PM runs for account PaperAcct1 from September` | Agent run history |
| `Show me run xyz-456` | Detail for a specific run |
| Show account holdings | Open positions |
| `How is it going with PaperAcct1 account` | Account summary |
| `What is happening with my portfolio` | Portfolio status update |
| `Give me an update on PaperAcct1` | Account update |
| `PaperAcct1 account holdings` | Holdings for a specific account |

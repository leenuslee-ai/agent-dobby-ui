import type { Message } from '../types';
import babyDobby from '../assets/baby-dobby.jpeg';
import { CandlebarChart } from './CandlebarChart';
import { BackTestResultsCard } from './BackTestResultsCard';
import { RecommendationCard } from './RecommendationCard';
import { SingleAccountCard, PortfolioAccountListCard } from './PortfolioAccountCard';
import { HoldingListCard } from './HoldingListCard';
import { PMAgentRunListCard } from './PMAgentRunListCard';
import { TradeListCard } from './TradeListCard';
import { TracePanel } from './TracePanel';

interface Props {
  message: Message;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';
  const isWide =
    message.data?.responseType === 'Candlebar data' ||
    message.data?.responseType === 'BackTestResults' ||
    message.data?.responseType === 'Recommendation' ||
    message.data?.responseType === 'TradeList' ||
    message.data?.responseType === 'PMAgentRunList' ||
    message.data?.responseType === 'HoldingList' ||
    message.data?.responseType === 'OpenHoldingList' ||
    message.data?.responseType === 'PortfolioAccount' ||
    message.data?.responseType === 'PortfolioAccountList';

  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* AI avatar + trace button stacked on the left */}
      {!isUser && (
        <div className="flex flex-col items-center gap-1 mr-2 shrink-0">
          <img src={babyDobby} alt="Dobby" className="w-8 h-8 rounded-full object-cover" />
          {message.trace && message.trace.length > 0 && (
            <TracePanel trace={message.trace} />
          )}
        </div>
      )}

      <div className={isWide ? 'flex-1 min-w-0' : 'max-w-[70%]'}>
        {message.content && (
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
              isUser
                ? 'bg-violet-600 text-white rounded-br-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
            }`}
          >
            {message.content}
          </div>
        )}

        {message.data?.responseType === 'Candlebar data' && (
          <CandlebarChart data={message.data} />
        )}

        {message.data?.responseType === 'BackTestResults' && (
          <BackTestResultsCard data={message.data} />
        )}

        {message.data?.responseType === 'Recommendation' && (
          <RecommendationCard data={message.data} />
        )}

        {message.data?.responseType === 'TradeList' && (
          <TradeListCard data={message.data} />
        )}

        {message.data?.responseType === 'PMAgentRunList' && (
          <PMAgentRunListCard data={message.data} />
        )}

        {message.data?.responseType === 'HoldingList' && (
          <HoldingListCard data={message.data} />
        )}

        {message.data?.responseType === 'OpenHoldingList' && (
          <HoldingListCard data={message.data} />
        )}

        {message.data?.responseType === 'PortfolioAccount' && (
          <SingleAccountCard account={message.data} />
        )}

        {message.data?.responseType === 'PortfolioAccountList' && (
          <PortfolioAccountListCard accounts={message.data.accounts} total={message.data.total} />
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold shrink-0 ml-2">
          U
        </div>
      )}
    </div>
  );
}

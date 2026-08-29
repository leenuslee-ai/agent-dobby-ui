import { useState, useCallback } from 'react';
import type { Message, StructuredResponse, PortfolioAccountListResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

function parseResponse(data: Record<string, unknown>): { content: string; structured?: StructuredResponse } {
  const response = data.response;

  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const r = response as Record<string, unknown>;
    if (r.responseType === 'Candlebar data') {
      return {
        content: `Candlestick chart for **${r.ticker}** — ${r.days} days (${r.time_interval} interval)`,
        structured: r as unknown as StructuredResponse,
      };
    }
    if (r.responseType === 'BackTestResults') {
      const s = r.summary as Record<string, unknown>;
      return {
        content: `Backtest results for **${s.ticker}** — ${s.setup}`,
        structured: r as unknown as StructuredResponse,
      };
    }
    if (r.responseType === 'PortfolioAccount') {
      return {
        content: `Portfolio account: **${r.display_name as string}**`,
        structured: r as unknown as StructuredResponse,
      };
    }
    if (r.responseType === 'PortfolioAccountList') {
      const list = r as unknown as PortfolioAccountListResponse;
      return {
        content: `${list.total} portfolio account${list.total !== 1 ? 's' : ''}`,
        structured: list,
      };
    }
    // Plain message object
    if (typeof r.message === 'string') {
      return { content: r.message };
    }
    // Other object responses: fall through to stringify
    return { content: JSON.stringify(response, null, 2) };
  }

  const text =
    typeof response === 'string'
      ? response
      : (data.content as string) ?? (data.message as string) ?? JSON.stringify(data);

  return { content: text };
}

export function useChat(threadId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/whatnext`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, message: content }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as Record<string, string>).message ?? `API error: ${response.status}`);
      }

      const data = await response.json() as Record<string, unknown>;
      const { content: text, structured } = parseResponse(data);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        data: structured,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [threadId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}

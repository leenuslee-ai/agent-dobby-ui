import { useEffect, useRef } from 'react';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import { LoginForm } from './components/LoginForm';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';

function ChatView({ threadId, username, onLogout }: { threadId: string; username: string; onLogout: () => void }) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat(threadId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
            AI
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Agent Dobby</h1>
            <p className="text-xs text-gray-500">@{username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearMessages}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded hover:bg-gray-100"
          >
            Clear
          </button>
          <button
            onClick={onLogout}
            className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full pt-20 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-violet-600">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">How can I help you?</h2>
              <p className="text-sm text-gray-400">Send a message to start the conversation.</p>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
          <p className="text-center text-xs text-gray-400 mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const { threadId, username, isLoading, error, login, logout } = useAuth();

  if (!threadId) {
    return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
  }

  return <ChatView threadId={threadId} username={username!} onLogout={logout} />;
}

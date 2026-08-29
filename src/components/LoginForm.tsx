import { useState, type FormEvent } from 'react';

interface Props {
  onLogin: (username: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function LoginForm({ onLogin, isLoading, error }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    await onLogin(username.trim(), password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white text-xl font-bold mb-4 shadow-md">
            AI
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to start chatting</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your username"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-gray-50 disabled:text-gray-400 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your password"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-gray-50 disabled:text-gray-400 transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

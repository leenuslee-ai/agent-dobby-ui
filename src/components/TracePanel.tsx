import { useState } from 'react';
import type { TraceStep } from '../types';

interface Props {
  trace: TraceStep[];
}

const STEP_META: Record<string, { label: string; icon: string; color: string }> = {
  user:        { label: 'User',        icon: '💬', color: 'text-violet-600 bg-violet-50 border-violet-100' },
  tool_call:   { label: 'Tool Call',   icon: '🔧', color: 'text-blue-600 bg-blue-50 border-blue-100'     },
  tool_result: { label: 'Tool Result', icon: '📦', color: 'text-teal-600 bg-teal-50 border-teal-100'     },
  assistant:   { label: 'Assistant',   icon: '🤖', color: 'text-gray-600 bg-gray-50 border-gray-100'     },
};

function StepCard({ step }: { step: TraceStep }) {
  const meta = STEP_META[step.step] ?? STEP_META.assistant;

  let body: React.ReactNode;

  if (step.step === 'tool_call') {
    body = (
      <>
        <div className="font-mono text-xs font-semibold text-gray-700">{step.tool}</div>
        <pre className="mt-1 text-xs text-gray-500 whitespace-pre-wrap break-all">
          {JSON.stringify(step.args, null, 2)}
        </pre>
      </>
    );
  } else if (step.step === 'tool_result') {
    body = (
      <>
        <div className="font-mono text-xs font-semibold text-gray-700">{step.tool}</div>
        <pre className="mt-1 text-xs text-gray-500 whitespace-pre-wrap break-all">
          {typeof step.content === 'string' ? step.content : JSON.stringify(step.content, null, 2)}
        </pre>
      </>
    );
  } else {
    body = <p className="text-xs text-gray-600 whitespace-pre-wrap">{step.content}</p>;
  }

  return (
    <div className={`rounded-lg border px-3 py-2 ${meta.color}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs">{meta.icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide">{meta.label}</span>
      </div>
      {body}
    </div>
  );
}

export function TracePanel({ trace }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="ml-3 shrink-0 w-64">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
          <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z" clipRule="evenodd" />
        </svg>
        <span className="flex-1 text-left">Trace ({trace.length} steps)</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2 max-h-96 overflow-y-auto pr-0.5">
          {trace.map((step, i) => (
            <StepCard key={i} step={step} />
          ))}
        </div>
      )}
    </div>
  );
}

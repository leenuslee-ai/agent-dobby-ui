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
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        title="View agent trace"
        className="mt-1 shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-violet-500">
                  <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-gray-800">Agent Trace</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{trace.length} steps</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            {/* Steps */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {trace.map((step, i) => (
                <StepCard key={i} step={step} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold shrink-0 mr-2 mt-1">
        AI
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

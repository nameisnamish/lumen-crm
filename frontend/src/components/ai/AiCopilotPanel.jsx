import { useState, useRef } from "react";
import { Sparkles, Send, Trash2, Bot, User, Loader2 } from "lucide-react";
import { Card, Button } from "../ui";
import { useCopilot } from "../../hooks/useCopilot";
import { cn } from "../../lib/utils";

/**
 * Floating AI Copilot chat panel.
 * Can be given an initial context (e.g. lead data) via props.
 */
export function AiCopilotPanel({ leadContext }) {
  const { messages, loading, sendMessage, clearChat, scrollRef } = useCopilot();
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input, leadContext ? { leadId: leadContext._id, company: leadContext.company } : {});
    setInput("");
    inputRef.current?.focus();
  };

  const quickPrompts = [
    "Summarize the pipeline health",
    "What deals need attention this week?",
    "Draft a follow-up email for the top lead",
    "What's the conversion rate trend?",
  ];

  return (
    <Card className="flex flex-col border border-brand-200 bg-gradient-to-br from-surface to-brand-50/30 shadow-lg max-h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">Lumen AI Copilot</h3>
            <p className="text-[10px] text-ink-soft">Powered by AI · Ask anything about your CRM</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-dark/5 hover:text-ink"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[200px] max-h-[340px]">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-ink-soft text-center">
              Ask me anything about your leads, pipeline, or sales strategy.
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-xl border border-line bg-surface px-3 py-2 text-left text-xs text-ink-soft hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2.5",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-brand-500 text-white"
                    : msg.isError
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-surface border border-line text-ink"
                )}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-600" />
            Thinking…
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line/60 px-4 py-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI copilot…"
          className="flex-1 rounded-xl border border-line bg-surface px-3.5 py-2 text-xs focus:border-brand-400 focus:outline-none"
          disabled={loading}
        />
        <Button size="sm" type="submit" disabled={loading || !input.trim()}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </Card>
  );
}

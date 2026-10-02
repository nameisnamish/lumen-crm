import { useState, useCallback, useRef } from "react";
import { aiApi } from "../lib/services";

/**
 * useCopilot — manages AI chat conversation state.
 * Demonstrates: useState for message history, useCallback for stable handlers,
 * useRef for scroll-to-bottom anchor.
 */
export function useCopilot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const sendMessage = useCallback(async (prompt, context = {}) => {
    if (!prompt.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const res = await aiApi.chat({ prompt, ...context });
      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: res.message || res.response || "AI response received.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || "AI copilot is unavailable right now.");
      const errMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I'm unable to respond right now. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      // Scroll to bottom after response
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
    scrollRef,
  };
}

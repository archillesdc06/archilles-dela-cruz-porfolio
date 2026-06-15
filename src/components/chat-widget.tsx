"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, MessageCircle, Send, Bot, User, Loader2, Sparkles, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ContactData {
  name?: string;
  email?: string;
  message?: string;
  step: "idle" | "ask_name" | "ask_email" | "ask_message" | "done";
}

const STORAGE_KEY = "archilles_chat_history";
const MAX_STORED_MESSAGES = 30;

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

function TypingDots() {
  return (
    <div className="flex items-center space-x-1 px-1 py-0.5">
      <span className="chat-dot" style={{ animationDelay: "0ms" }} />
      <span className="chat-dot" style={{ animationDelay: "160ms" }} />
      <span className="chat-dot" style={{ animationDelay: "320ms" }} />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${
          isUser ? "bg-blue-600" : "bg-gradient-to-br from-indigo-500 to-blue-600"
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={`text-[10px] mt-1 ${
            isUser ? "text-blue-100 text-right" : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [contactData, setContactData] = useState<ContactData>({ step: "idle" });
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Load chat history from localStorage ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })));
          return;
        }
      }
    } catch {}

    // First-time greeting
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content:
          "Hi! 👋 I'm Archilles' AI Portfolio Assistant!\n\nI can help you learn about:\n• His skills & tech stack\n• Work experience & projects\n• Education & certifications\n• How to contact or hire him\n\nWhat would you like to know? 😊",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // ── Save to localStorage when messages change ──
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      const toStore = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {}
  }, [messages]);

  // ── Auto-scroll to bottom ──
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom(false), 50);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Scroll indicator ──
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollDown(scrollHeight - scrollTop - clientHeight > 80);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Notification dot when chat is closed ──
  const handleNewMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
    if (!isOpen) setHasNewMessage(true);
  }, [isOpen]);

  const addMessage = useCallback((role: "user" | "assistant", content: string): Message => {
    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    };
    if (role === "assistant") {
      handleNewMessage(msg);
    } else {
      setMessages((prev) => [...prev, msg]);
    }
    return msg;
  }, [handleNewMessage]);

  // ── Contact collection flow ──
  const handleContactFlow = useCallback(
    async (userText: string): Promise<boolean> => {
      if (contactData.step === "idle") return false;

      if (contactData.step === "ask_name") {
        const name = userText.trim();
        setContactData((prev) => ({ ...prev, name, step: "ask_email" }));
        addMessage(
          "assistant",
          `Thanks, ${name}! 😊 Ano ang iyong email address? / What's your email address?`
        );
        return true;
      }

      if (contactData.step === "ask_email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userText.trim())) {
          addMessage(
            "assistant",
            "Hmm, mukhang hindi valid ang email. Pakisubukan ulit? (e.g. yourname@gmail.com)"
          );
          return true;
        }
        setContactData((prev) => ({ ...prev, email: userText.trim(), step: "ask_message" }));
        addMessage(
          "assistant",
          "Perfect! ✅ Ano ang mensahe mo para kay Archilles? Pwede mong ilagay dito ang iyong alok, tanong, o project details."
        );
        return true;
      }

      if (contactData.step === "ask_message") {
        const userMessage = userText.trim();
        const updatedContact = { ...contactData, message: userMessage, step: "done" as const };
        setContactData(updatedContact);

        setIsLoading(true);
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contactData: {
                name: updatedContact.name,
                email: updatedContact.email,
                message: userMessage,
              },
            }),
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (data?.sent) {
            addMessage(
              "assistant",
              `✅ Napadala na ang iyong mensahe kay Archilles!\n\nSummary:\n📛 Name: ${updatedContact.name}\n📧 Email: ${updatedContact.email}\n💬 Message: ${userMessage}\n\nMag-reply si Archilles sa iyong email as soon as possible. Salamat! 🙏`
            );
          } else {
            addMessage(
              "assistant",
              `Nagpadala na kami ng mensahe mo. Alternatively, you can directly email Archilles at:\n📧 archillesdelacruzemail@gmail.com\n📞 0975 077 3561`
            );
          }
        } catch {
          addMessage(
            "assistant",
            `May error na nangyari, pero heto ang contact info ni Archilles:\n📧 archillesdelacruzemail@gmail.com\n📞 0975 077 3561`
          );
        } finally {
          setIsLoading(false);
          setContactData({ step: "idle" });
        }
        return true;
      }

      return false;
    },
    [contactData, addMessage]
  );

  // ── Main send handler ──
  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue("");
    addMessage("user", text);
    setIsLoading(true);

    // Check contact flow first
    const handledByContactFlow = await handleContactFlow(text);
    if (handledByContactFlow) {
      setIsLoading(false);
      return;
    }

    try {
      const conversationMessages = [
        ...messages.filter((m) => m.id !== "greeting"),
        { role: "user", content: text },
      ].slice(-20); // last 20 messages for context

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationMessages }),
      });

      if (!response.ok) throw new Error("API error");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const aiMessage = String(data?.message ?? "Sorry, may error. Please try again.");

      addMessage("assistant", aiMessage);

      // Detect if AI is initiating contact collection
      const lowerMsg = aiMessage.toLowerCase();
      const isAskingForContact =
        (lowerMsg.includes("pangalan") || lowerMsg.includes("name") || lowerMsg.includes("anong pangalan")) &&
        (lowerMsg.includes("email") || lowerMsg.includes("makipag-ugnayan") || lowerMsg.includes("contact")) &&
        contactData.step === "idle";

      if (isAskingForContact) {
        setContactData({ step: "ask_name" });
      }
    } catch {
      addMessage("assistant", "Sorry, may error na nangyari. Pakisubukan ulit mamaya. 🙏");
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, handleContactFlow, addMessage, contactData.step]);

  // ── Enter key to send ──
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend]
  );

  // ── Clear chat ──
  const clearChat = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContactData({ step: "idle" });
    setMessages([
      {
        id: "greeting-new",
        role: "assistant",
        content: "Chat cleared! 🗑️ How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    setHasNewMessage(false);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  return (
    <>
      {/* ── CSS for animations ── */}
      <style>{`
        .chat-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94a3b8;
          animation: chatBounce 1s infinite ease-in-out;
        }
        @keyframes chatBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        .chat-window-enter {
          animation: chatWindowIn 0.25s cubic-bezier(0.34, 1.4, 0.64, 1);
          transform-origin: bottom right;
        }
        @keyframes chatWindowIn {
          from { opacity: 0; transform: scale(0.9) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .chat-bubble-pulse {
          animation: bubblePulse 2.5s infinite;
        }
        @keyframes bubblePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
          60% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
        }
        .notification-badge {
          animation: badgePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes badgePop {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .chat-messages-scroll {
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .chat-messages-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .chat-messages-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-messages-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .dark .chat-messages-scroll::-webkit-scrollbar-thumb {
          background-color: #334155;
        }
      `}</style>

      {/* ── Floating Chat Button ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Toggle Button */}
        <button
          id="chat-toggle-btn"
          onClick={toggleChat}
          aria-label="Toggle AI Chat"
          className={`relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center ${
            !isOpen ? "chat-bubble-pulse" : ""
          }`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}

          {/* Notification Badge */}
          {hasNewMessage && !isOpen && (
            <span className="notification-badge absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="chat-window-enter fixed z-50 flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900"
          style={{
            bottom: "88px",
            right: "24px",
            width: "360px",
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "calc(100vh - 110px)",
            height: "540px",
          }}
        >
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Archilles AI Assistant
                </h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online • Portfolio Expert
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="text-white/70 hover:text-white transition-colors text-xs px-2 py-1 rounded-lg hover:bg-white/10"
              >
                Clear
              </button>
              <button
                onClick={toggleChat}
                className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area — this is the scrollable zone */}
          <div
            ref={messagesContainerRef}
            className="chat-messages-scroll flex-1 p-3 space-y-3 min-h-0"
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom button */}
          {showScrollDown && (
            <button
              onClick={() => scrollToBottom()}
              className="absolute right-4 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10"
              style={{ bottom: "130px" }}
            >
              <ChevronDown className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            </button>
          )}

          {/* Quick Suggestion Chips */}
          {messages.length <= 2 && (
            <div className="flex-shrink-0 px-3 pb-2 flex flex-wrap gap-1.5">
              {[
                "What are his skills?",
                "Tell me about his projects",
                "I want to hire him",
                "Ano ang experience niya?",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setInputValue(chip);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                id="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Archilles..."
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                style={{ height: "38px", maxHeight: "96px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "38px";
                  target.style.height = `${Math.min(target.scrollHeight, 96)}px`;
                }}
              />
              <button
                id="chat-send-btn"
                onClick={() => void handleSend()}
                disabled={isLoading || !inputValue.trim()}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white flex items-center justify-center transition-all duration-200 hover:shadow-md active:scale-95"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1.5 text-center">
              Powered by Groq AI • Portfolio & Resume queries only
            </p>
          </div>
        </div>
      )}
    </>
  );
}

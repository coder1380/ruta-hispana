'use client';

import React, { useState, useRef, useEffect } from 'react';
import { renderBilingualContent } from './SpanishTooltip';
import {
  MessageSquare,
  Send,
  Loader2,
  Volume2,
  User,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  isFallback?: boolean;
}

interface GuideChatbotProps {
  countryId: string;
  countryName: string;
}

export const GuideChatbot: React.FC<GuideChatbotProps> = ({ countryId, countryName }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        `Hello! I am **Mateo**, your local travel guide for ${countryName}. Ask me about its regions, landmarks, festivals, food, and living traditions.`,
      source: `${countryName} Guide`,
      isFallback: false,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '🌱 Which vegetarian tapas are safest to order?',
    '🎒 How does the afternoon siesta work in small towns?',
    '🏰 What are the most impressive historic castillos and palaces?',
    '🥘 What time do locals go for dinner and tapeo?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryId,
          message: userMsg.content,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          source: data.source,
          isFallback: data.isFallback,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          id: `assistant-fallback-${Date.now()}`,
          role: 'assistant',
          content:
            `I can't reach the guide service right now. You can still explore the verified landmarks, festivals, and food listed for ${countryName}.`,
          source: `${countryName} (Offline Guide)`,
          isFallback: true,
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content:
          `I can't reach the guide service right now. Please try again, or browse the regional highlights and food guide for ${countryName}.`,
        source: `${countryName} (Offline Guide)`,
        isFallback: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\*\*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-cream text-ink">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-ink">
              Mateo · Guía de Viaje
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          </div>
          <p className="text-xs text-ink/70 font-body">
            Local cultural companion. English answers with natural Spanish terms.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'reset',
                role: 'assistant',
                content:
                  `Hello again! Ask any question about ${countryName}, its regions, food, festivals, or local traditions.`,
                source: `${countryName} Guide`,
              },
            ])
          }
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-sand bg-sand/40 text-xs font-medium text-ink hover:text-terracotta hover:border-terracotta transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset chat</span>
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt)}
            disabled={loading}
            className="text-xs px-2.5 py-1 rounded-lg bg-sand/60 border border-sand hover:border-terracotta hover:text-terracotta transition-all text-left text-ink font-body disabled:opacity-50 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="h-[340px] overflow-y-auto space-y-3 pr-1 mb-4 rounded-xl p-3 bg-sand/20 border border-sand">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-terracotta text-cream flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-display shadow-2xs">
                  M
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-body shadow-2xs ${
                  isUser
                    ? 'bg-terracotta text-cream rounded-br-xs'
                    : 'bg-cream text-ink border border-sand rounded-bl-xs'
                }`}
              >
                <div className="leading-relaxed">
                  {isUser ? msg.content : renderBilingualContent(msg.content)}
                </div>

                {!isUser && (
                  <div className="mt-2 pt-1 border-t border-sand/50 flex items-center justify-between text-[10px] text-ink/60">
                    <span className="font-mono">{msg.source || 'Mateo'}</span>
                    <button
                      onClick={() => speakText(msg.content)}
                      className="hover:text-terracotta p-0.5 rounded cursor-pointer"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-sand text-ink flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2 items-center text-xs text-terracotta p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Mateo is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about tapas, cities, flamenco, or train travel..."
          disabled={loading}
          className="flex-1 bg-cream border border-sand rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-ink/40 focus:outline-none focus:border-terracotta transition-colors"
        />
        <button
          onClick={() => sendMessage(inputMessage)}
          disabled={loading || !inputMessage.trim()}
          className="px-4 py-2 bg-terracotta text-cream rounded-xl text-xs font-semibold hover:bg-terracotta/90 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};

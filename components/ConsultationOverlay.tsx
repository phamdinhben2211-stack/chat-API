import React, { useState, useRef, useEffect } from "react";
import { LanguageCode, ChatMessage } from "../types";
import { createConsultationSession, sendMessageToExpert } from "../services/geminiService";
import { Button } from "./Button";

interface ConsultationOverlayProps {
  plantName: string;
  plantContext: string; // Serialized string of plant info for context
  language: LanguageCode;
  onClose: () => void;
}

const TEXTS: Record<LanguageCode, any> = {
  vi: {
    title: "Tư vấn Chuyên gia AI",
    subtitle: "Hỏi đáp về cách chăm sóc & trị bệnh",
    placeholder: "Nhập câu hỏi của bạn (VD: Tại sao lá bị vàng?)...",
    send: "Gửi",
    thinking: "AI đang suy nghĩ...",
    welcome: `Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho cây ${"plant"} của bạn?`,
  },
  en: {
    title: "AI Expert Consultation",
    subtitle: "Ask about care & disease treatment",
    placeholder: "Type your question (e.g., Why are leaves turning yellow?)...",
    send: "Send",
    thinking: "AI is thinking...",
    welcome: `Hello! I'm your AI assistant. How can I help with your ${"plant"}?`,
  },
  fr: {
    title: "Consultation Expert IA",
    subtitle: "Questions sur les soins et traitements",
    placeholder: "Tapez votre question...",
    send: "Envoyer",
    thinking: "L'IA réfléchit...",
    welcome: `Bonjour! Je suis votre assistant IA. Comment puis-je aider avec votre ${"plant"}?`,
  },
  ja: {
    title: "AI専門家相談",
    subtitle: "ケアと病気の治療について尋ねる",
    placeholder: "質問を入力してください...",
    send: "送信",
    thinking: "AIが考え中...",
    welcome: `こんにちは！AIアシスタントです。${"plant"}についてどうお手伝いできますか？`,
  },
  zh: {
    title: "AI专家咨询",
    subtitle: "询问有关护理和疾病治疗的问题",
    placeholder: "输入您的问题...",
    send: "发送",
    thinking: "AI正在思考...",
    welcome: `你好！我是AI助手。我能为您${"plant"}做什么？`,
  },
};

export const ConsultationOverlay: React.FC<ConsultationOverlayProps> = ({
  plantName,
  plantContext,
  language,
  onClose,
}) => {
  const t = TEXTS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    chatSessionRef.current = createConsultationSession(plantContext, language);
    // Add welcome message
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: t.welcome.replace("plant", plantName),
        timestamp: Date.now(),
      },
    ]);
  }, [plantName, plantContext, language]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await sendMessageToExpert(chatSessionRef.current, userMsg.text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error", error);
      // Handle error gracefully in UI if needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
             </div>
             <div>
               <h3 className="text-white font-bold text-lg">{t.title}</h3>
               <p className="text-emerald-100 text-xs">{t.subtitle}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                }`}
              >
                {/* Simple Markdown rendering for bold/list support could be added here */}
                <div style={{whiteSpace: 'pre-wrap'}}>{msg.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-gray-200 text-gray-500 rounded-2xl rounded-tl-none px-4 py-3 text-xs italic animate-pulse">
                 {t.thinking}
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              disabled={isLoading}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <Button 
               onClick={handleSend} 
               disabled={isLoading || !input.trim()}
               className="!rounded-full !w-10 !h-10 !p-0 flex items-center justify-center shrink-0"
            >
               <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
               </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { TitanLogo } from './TitanLogo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface GeminiChatbotProps {
  userName?: string;
  userRole?: string;
  theme?: 'dark' | 'light';
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  userName = 'Masab Bin Abdul Rehman',
  userRole = 'student',
  theme = 'dark'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: `Assalam Alaikum ${userName}! I am TITAN AI, the integrated academic assistant for Taj Institute of Technology & Applied Networks. How can I help with your studies, courses, or certificates today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text To Speech helper
  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (speakingMsgId === msgId) {
      setSpeakingMsgId(null);
      return;
    }

    // Clean markdown bold syntax before speaking
    const cleanText = text.replace(/\*\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle Voice Recording
  const toggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please try Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInputMessage(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    // Stop listening if sending message
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          userName,
          userRole
        })
      });

      const data = await response.json();
      const replyText = data.reply || 'I am ready to help you with your coursework at Taj Institute of Technology & Applied Networks.';
      
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);

      // Auto read response if voice output is toggled on
      if (voiceOutputEnabled) {
        speakText(replyText, botMsg.id);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackText = `Regarding "${text}": You can explore course modules, complete interactive lessons, and view official certificates issued by Taj Institute of Technology & Applied Networks in your portal.`;
      const fallbackMsg: ChatMessage = {
        id: `b-err-${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);

      if (voiceOutputEnabled) {
        speakText(fallbackText, fallbackMsg.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = theme === 'dark';

  const quickPrompts = [
    'Tell me about Taj Institute of Technology',
    'Help with Linear Regression in Data Science 101',
    'How do I earn & download my certificates?',
    'Give me study tips for my upcoming deadlines'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {/* Closed Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 text-white p-3.5 pr-5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 ring-2 ring-indigo-400/30"
          title="Open TITAN AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl animate-pulse">auto_awesome</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-zinc-950"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-headline font-bold text-xs tracking-wide">TITAN AI Assistant</span>
            <span className="text-[10px] font-mono text-indigo-100 opacity-90 flex items-center gap-1">
              <span>Voice Ready</span>
              <span>•</span>
              <span>Gemini 2.5</span>
            </span>
          </div>
        </button>
      )}

      {/* Open Chat Dialog Container */}
      {isOpen && (
        <div
          className={`w-[90vw] sm:w-[410px] h-[540px] rounded-[2.5rem] shadow-2xl border flex flex-col overflow-hidden transition-all duration-300 ${
            isDark
              ? 'bg-zinc-950 border-zinc-800 text-white shadow-indigo-950/40'
              : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-400/40'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-900 via-blue-900 to-zinc-900 border-b border-indigo-500/20 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-black/30 rounded-xl border border-white/10">
                <TitanLogo size="sm" variant="icon" theme="dark" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-sm tracking-tight flex items-center gap-1.5">
                  <span>TITAN Buddy</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/30 text-emerald-300 rounded-md text-[9px] font-mono uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Voice Active
                  </span>
                </h3>
                <p className="text-[10px] font-mono text-indigo-200 opacity-90">
                  Taj Institute of Technology & Applied Networks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Readout Auto-Speak Toggle */}
              <button
                onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
                className={`p-1.5 rounded-full transition-colors ${
                  voiceOutputEnabled ? 'bg-emerald-500/30 text-emerald-300' : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
                title={voiceOutputEnabled ? 'Auto Voice Output: ON' : 'Auto Voice Output: OFF'}
              >
                <span className="material-symbols-outlined text-lg">
                  {voiceOutputEnabled ? 'volume_up' : 'volume_off'}
                </span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Minimize Assistant"
              >
                <span className="material-symbols-outlined text-xl">remove</span>
              </button>
            </div>
          </div>

          {/* Chat Message Scroll Thread */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs relative group ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : isDark
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-none'
                      : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] text-indigo-400 font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs">auto_awesome</span>
                        TITAN AI
                      </div>
                      
                      {/* Text to Speech Button for Bot Messages */}
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`p-1 rounded-md transition-colors ${
                          speakingMsgId === msg.id
                            ? 'text-emerald-400 bg-emerald-500/20 animate-pulse'
                            : 'text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800'
                        }`}
                        title="Listen to response"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {speakingMsgId === msg.id ? 'graphic_eq' : 'volume_up'}
                        </span>
                      </button>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col items-start">
                <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                  isDark ? 'bg-zinc-900 border border-zinc-800 text-indigo-400' : 'bg-white border border-zinc-200 text-indigo-600'
                }`}>
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                  <span className="font-mono text-[11px]">TITAN AI is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Listening Live Waveform Overlay Banner */}
          {isListening && (
            <div className="px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 text-white flex items-center justify-between font-mono text-xs animate-pulse">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg animate-ping">mic</span>
                <span className="font-bold">Listening... Speak now</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></span>
              </div>
            </div>
          )}

          {/* Quick Prompt Suggestion Chips */}
          <div className={`px-3 py-2 border-t overflow-x-auto custom-scrollbar flex gap-1.5 text-[11px] font-mono shrink-0 ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-zinc-200'
          }`}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all border shrink-0 ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-indigo-500 hover:text-white'
                    : 'bg-white border-zinc-300 text-zinc-700 hover:border-indigo-500 hover:text-zinc-900'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer with Voice Mic Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className={`p-3 border-t flex items-center gap-2 ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Type or speak message..."}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-full text-xs font-body focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                isListening
                  ? 'bg-red-500/10 border-red-500/50 text-red-400 placeholder-red-400/70 ring-2 ring-red-500/20'
                  : isDark
                  ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500'
                  : 'bg-slate-100 border border-zinc-200 text-zinc-900 placeholder-zinc-400'
              }`}
            />

            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 border ${
                isListening
                  ? 'bg-red-600 text-white border-red-400 animate-pulse scale-110 shadow-lg shadow-red-600/50'
                  : isDark
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-indigo-400 hover:border-indigo-500'
                  : 'bg-slate-100 border-zinc-300 text-zinc-700 hover:text-indigo-600 hover:border-indigo-500'
              }`}
              title={isListening ? 'Stop Voice Input' : 'Speak with Voice Input'}
            >
              <span className="material-symbols-outlined text-lg">
                {isListening ? 'mic_off' : 'mic'}
              </span>
            </button>

            {/* Send Message Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full disabled:opacity-50 transition-colors shadow-md flex items-center justify-center shrink-0"
              title="Send Message"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

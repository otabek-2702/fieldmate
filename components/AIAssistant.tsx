
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Mic, QrCode, Trash2, Shield, Zap, Target } from 'lucide-react';
import { Message } from '../types';
import { getAIRecommendation } from '../services/geminiService';

const AIAssistant: React.FC<{ active: boolean; onScanClick: () => void; isDarkMode?: boolean }> = ({ active, onScanClick, isDarkMode }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Салам, Капитан! ⚽️\n\nЯ Аха — твой персональный Гуру. Я знаю о футболе всё: от того, как закрутить "сухой лист", до того, на каком поле Ташкента газон мягче твоих домашних тапочек.\n\nНужен тактический план на игру? Или ищем идеальную коробку на вечер? Выкладывай, я в игре!' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customInput?: string) => {
    const userMsg = (customInput || input).trim();
    if (!userMsg) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    const aiResponse = await getAIRecommendation(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([{ 
      role: 'assistant', 
      content: 'Поле очищено, команды готовы к выходу! Какой будет твой первый пас? Спрашивай о чем угодно футбольном.' 
    }]);
  };

  const quickChips = [
    { label: 'Где лучший газон?', icon: Target, prompt: 'Где в Ташкенте сейчас самый лучший газон для игры?' },
    { label: 'Как победить сегодня?', icon: Zap, prompt: 'Дай тактический совет на сегодня, чтобы мы разгромили соперника.' },
    { label: 'Собери мне состав', icon: Shield, prompt: 'Как лучше расставить 6 человек на поле 40х20?' }
  ];

  if (!active) return null;

  return (
    <div className={`flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-300 ${isDarkMode ? 'bg-black' : 'bg-merino'}`}>
      <div className={`p-6 shrink-0 shadow-xl border-b-4 transition-colors duration-500 ${isDarkMode ? 'bg-lunar-green text-white border-pale-olive/20' : 'bg-lunar-green text-white border-pale-olive'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-black/40' : 'bg-white'}`}>
              <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-pale-olive' : 'text-lunar-green'}`} />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase leading-tight">Аха Гуру</h2>
              <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-pale-olive/60' : 'text-pale-olive'}`}>Эксперт высшей лиги</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={clearChat} className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all">
              <Trash2 className="w-5 h-5 text-white" />
            </button>
            <button onClick={onScanClick} className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all">
              <QrCode className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickChips.map((chip, i) => (
            <button 
              key={i}
              onClick={() => handleSend(chip.prompt)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${isDarkMode ? 'bg-black/40 border-pale-olive/20 text-pale-olive hover:border-pale-olive' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
            >
              <chip.icon className="w-3 h-3" />
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.role === 'user' ? 'bg-pale-olive border-white text-lunar-green' : isDarkMode ? 'bg-lunar-green border-pale-olive text-white' : 'bg-white border-lunar-green text-lunar-green'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-5 rounded-[24px] text-sm leading-relaxed shadow-xl border-2 whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-lunar-green text-white border-pale-olive rounded-tr-none font-bold' 
                  : isDarkMode 
                    ? 'bg-lunar-green/50 text-white border-pale-olive/20 rounded-tl-none italic'
                    : 'bg-white text-lunar-green border-merino rounded-tl-none font-medium italic'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-3">
             <div className={`w-10 h-10 rounded-[14px] shadow-lg flex items-center justify-center border-2 ${isDarkMode ? 'bg-lunar-green border-pale-olive' : 'bg-white border-lunar-green'}`}>
               <Bot className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-lunar-green'}`} />
             </div>
             <div className={`p-5 rounded-[24px] shadow-xl border-2 flex gap-2 items-center ${isDarkMode ? 'bg-lunar-green/30 border-pale-olive/10' : 'bg-white border-merino'}`}>
                <div className="w-2 h-2 bg-pale-olive rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pale-olive rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-pale-olive rounded-full animate-bounce [animation-delay:0.4s]"></div>
             </div>
          </div>
        )}
      </div>

      <div className={`p-6 border-t-4 shadow-2xl transition-colors duration-500 ${isDarkMode ? 'bg-black border-pale-olive/20' : 'bg-white border-pale-olive'}`}>
        <div className="flex gap-3">
          <div className={`flex-1 rounded-[24px] px-6 py-4 flex items-center gap-3 border-4 transition-all ${isDarkMode ? 'bg-lunar-green border-pale-olive/10 focus-within:border-pale-olive' : 'bg-merino border-merino focus-within:border-pale-olive'}`}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Спроси Аха про тактику или поля..." 
              className={`bg-transparent border-none focus:outline-none flex-1 text-sm font-black ${isDarkMode ? 'text-white placeholder-white/30' : 'text-lunar-green placeholder-lunar-green/30'}`}
            />
            <Mic className={`w-6 h-6 cursor-pointer ${isDarkMode ? 'text-pale-olive/60 hover:text-pale-olive' : 'text-lunar-green/40 hover:text-lunar-green'}`} />
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-16 h-16 bg-pale-olive text-white rounded-[24px] flex items-center justify-center disabled:opacity-30 shadow-2xl active:scale-90 transition-all border-b-4 border-black/20"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

'use client';

import { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/project-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, Cpu } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ModelOption {
  id: string;
  label: string;
  provider: string;
  available: boolean;
}

const MODEL_STORAGE_KEY = 'stackgenSelectedModel';

export function AiChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: 'Hello! I am your AI CTO Assistant. Ask me anything about your architecture or software engineering.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const projectState = useProjectStore();

  useEffect(() => {
    if (!isOpen) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/models`)
      .then(res => res.json())
      .then((list: ModelOption[]) => {
        if (!Array.isArray(list)) return;
        setModels(list);
        const saved = typeof window !== 'undefined' ? window.localStorage.getItem(MODEL_STORAGE_KEY) : null;
        const savedOk = list.find(m => m.available && m.id === saved);
        if (savedOk) {
          setSelectedModel(savedOk.id);
        } else {
          const firstAvailable = list.find(m => m.available);
          setSelectedModel(firstAvailable?.id || null);
        }
      })
      .catch(() => { /* model list is optional; empty list hides the selector */ });
  }, [isOpen]);

  const handleModelChange = (id: string) => {
    setSelectedModel(id);
    window.localStorage.setItem(MODEL_STORAGE_KEY, id);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel,
          context: {
            projectName: projectState.projectName,
            description: projectState.description,
            techStack: projectState.techStack,
            progress: projectState.progress
          }
        })
      });
      if (!res.ok) {
        const fallback = res.status === 401
          ? 'Please log in to use the AI assistant.'
          : 'Sorry, I encountered an error. Please try again in a few seconds.';
        setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
        return;
      }
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your backend connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={
        <Button variant="default" size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-500 z-50">
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      } />
      <SheetContent className="w-[400px] sm:w-[540px] bg-zinc-950 border-zinc-800 flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-zinc-800">
          <SheetTitle className="text-zinc-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">AI</div>
            CTO Assistant
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 whitespace-pre-wrap'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-800">
          {models.some(m => m.available) && (
            <div className="flex items-center gap-2 px-4 pt-3 text-xs text-zinc-500">
              <Cpu className="w-3.5 h-3.5" />
              <select
                value={selectedModel ?? ''}
                onChange={e => handleModelChange(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
              >
                {models.filter(m => m.available).map(m => (
                  <option key={m.id} value={m.id}>
                    {m.label} · {m.provider}
                  </option>
                ))}
              </select>
            </div>
          )}
          <form onSubmit={handleSend} className="flex gap-2 p-4">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your architecture..."
              className="bg-zinc-900 border-zinc-800 text-zinc-100"
            />
            <Button type="submit" disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-500 text-white">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

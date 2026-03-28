import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Namaste! I'm Artha, your personal AI finance advisor. What's your name? And what's one money thing stressing you out most right now?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "What is SIP?",
    "Old vs new tax regime",
    "How much term insurance?",
    "Rate my money health",
    "FIRE number for me",
    "Best tax saving options"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: "user", content: text };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/ask', {
        message: text,
        history: messages  // send full conversation history
      });

      const aiMsg = { role: "assistant", content: res.data.answer };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = { role: "assistant", content: "Sorry yaar, something went wrong. Try again in a second." };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageTime = () => {
    return new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted mt-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-muted/50" />
            <h3 className="text-lg font-semibold mb-2">Welcome to AI Money Mentor</h3>
            <p className="text-sm">Ask me anything about personal finance, investments, taxes, and more!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} message-bubble`}
          >
            <div
              className={`max-w-[65%] flex items-start space-x-2 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-accent' : 'bg-muted/30'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-muted" />
                )}
              </div>
              <div>
                {message.role === 'assistant' && index === 0 && (
                  <p className="text-xs text-accent font-medium mb-1" style={{ fontSize: '12px', color: '#e94560', fontWeight: 500 }}>Artha</p>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-accent text-white rounded-br-sm'
                      : 'bg-card text-text rounded-bl-sm border-l-[3px] border-l-accent border border-muted/20'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-muted mt-1 px-1" style={{ fontSize: '11px' }}>
                  {getMessageTime()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] md:max-w-[60%] flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/30">
                <Bot className="w-4 h-4 text-muted" />
              </div>
              <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-3 border border-muted/20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-muted rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-muted rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="px-5 py-3 border-t border-muted/20">
          <div className="flex gap-2 overflow-x-auto chips-row pb-0">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
                className="text-xs bg-transparent border border-[rgba(255,255,255,0.15)] px-4 py-2 rounded-full text-muted hover:text-accent hover:border-accent transition-all duration-200 whitespace-nowrap"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="px-5 py-4 border-t border-muted/20">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            className="flex-1 input-field rounded-[24px]"
            style={{ borderRadius: '24px' }}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary rounded-full w-11 h-11 flex items-center justify-center transition-transform hover:scale-105"
            style={{ width: '44px', height: '44px', borderRadius: '50%' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

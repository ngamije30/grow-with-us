'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  PaperAirplaneIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Mock chat data for demonstration
const mockMessages = [
  {
    id: 1,
    sender: 'mentor',
    content: 'Hi! Thanks for connecting. I'd love to hear more about your career goals.',
    timestamp: '2024-03-15T10:00:00Z',
  },
  {
    id: 2,
    sender: 'user',
    content: 'Hello! I'm really interested in becoming a full-stack developer. I have some experience with React and Node.js.',
    timestamp: '2024-03-15T10:05:00Z',
  },
  {
    id: 3,
    sender: 'mentor',
    content: 'That's great! Have you worked on any full-stack projects so far?',
    timestamp: '2024-03-15T10:10:00Z',
  },
];

interface Message {
  id: number;
  sender: 'user' | 'mentor';
  content: string;
  timestamp: string;
}

interface ChatProps {
  mentorName: string;
  mentorImage?: string;
  onClose: () => void;
}

export default function Chat({ mentorName, mentorImage, onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const message: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setIsLoading(false);

    // Simulate mentor response
    setTimeout(() => {
      const mentorResponse: Message = {
        id: messages.length + 2,
        sender: 'mentor',
        content: 'Thanks for your message! I'll get back to you soon.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, mentorResponse]);
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex h-[600px] flex-col rounded-lg border border-gray-200 bg-white">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          {mentorImage ? (
            <img
              src={mentorImage}
              alt={mentorName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
          )}
          <div>
            <h3 className="font-medium text-gray-900">{mentorName}</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        <button
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`mt-1 text-xs ${
                    message.sender === 'user'
                      ? 'text-primary-100'
                      : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow rounded-md border-gray-300 focus:border-primary focus:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
} 
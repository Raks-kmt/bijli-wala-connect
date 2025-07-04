
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import { Send, MessageCircle, X } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface LiveChatWidgetProps {
  recipientId: string;
  recipientName: string;
  isOpen: boolean;
  onClose: () => void;
}

const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ 
  recipientId, 
  recipientName, 
  isOpen, 
  onClose 
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { sendMessage, isConnected } = useRealtime();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading existing messages
    const demoMessages: Message[] = [
      {
        id: '1',
        senderId: recipientId,
        message: language === 'hi' ? 'नमस्ते! मैं कैसे मदद कर सकता हूं?' : 'Hello! How can I help you?',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        isRead: true
      }
    ];
    setMessages(demoMessages);
  }, [recipientId, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        message: newMessage,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      setMessages(prev => [...prev, message]);
      sendMessage(recipientId, newMessage);
      setNewMessage('');

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate response
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: recipientId,
          message: language === 'hi' ? 'धन्यवाद! मैं जल्दी जवाब दूंगा।' : 'Thank you! I will respond soon.',
          timestamp: new Date().toISOString(),
          isRead: false
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 max-w-sm z-50">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <CardTitle className="text-sm">{recipientName}</CardTitle>
              {isConnected && (
                <Badge variant="default" className="text-xs">
                  {language === 'hi' ? 'ऑनलाइन' : 'Online'}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.senderId === user?.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder={language === 'hi' ? 'संदेश टाइप करें...' : 'Type a message...'}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!isConnected}
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChatWidget;

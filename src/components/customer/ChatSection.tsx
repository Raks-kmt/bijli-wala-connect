
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '../../contexts/LanguageContext';
import { Send, Phone, Video } from 'lucide-react';

const ChatSection = () => {
  const { language } = useLanguage();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const chats = [
    {
      id: '1',
      electrician: language === 'hi' ? 'राम कुमार' : 'Ram Kumar',
      lastMessage: language === 'hi' ? 'मैं 15 मिनट में आऊंगा' : 'I will come in 15 minutes',
      time: '2:30 PM',
      unread: 2,
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      electrician: language === 'hi' ? 'सुरेश शर्मा' : 'Suresh Sharma',
      lastMessage: language === 'hi' ? 'काम पूरा हो गया' : 'Work completed',
      time: '1:45 PM',
      unread: 0,
      avatar: '/placeholder.svg'
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'customer',
      message: language === 'hi' ? 'आप कब आएंगे?' : 'When will you come?',
      time: '2:25 PM'
    },
    {
      id: '2',
      sender: 'electrician',
      message: language === 'hi' ? 'मैं 15 मिनट में आऊंगा' : 'I will come in 15 minutes',
      time: '2:30 PM'
    }
  ];

  const sendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  if (!selectedChat) {
    return (
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold mb-4">
          {language === 'hi' ? 'चैट' : 'Chats'}
        </h2>
        {chats.map((chat) => (
          <Card key={chat.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedChat(chat.id)}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <img src={chat.avatar} alt={chat.electrician} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{chat.electrician}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{chat.time}</span>
                      {chat.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const currentChat = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedChat(null)}>
              ←
            </Button>
            <img src={currentChat?.avatar} alt={currentChat?.electrician} className="w-10 h-10 rounded-full" />
            <h3 className="font-semibold">{currentChat?.electrician}</h3>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg ${
              msg.sender === 'customer' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs opacity-70 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            placeholder={language === 'hi' ? 'संदेश टाइप करें...' : 'Type a message...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;

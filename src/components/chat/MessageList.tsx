import { useEffect, useState } from 'react';
import { messageService } from '../../services/api';
import { io } from 'socket.io-client';

export const MessageList = ({ otherUserId }: { otherUserId: string }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
    
    socket.emit('join', otherUserId);
    
    socket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [otherUserId]);

  const sendMessage = async () => {
    try {
      const message = await messageService.sendMessage({
        receiverId: otherUserId,
        content: newMessage,
      });
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((message: any) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
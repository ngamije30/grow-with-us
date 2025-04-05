import { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { useAuthStore } from '../../store/auth.store';

interface CollaborationUser {
  id: string;
  name: string;
  cursor: { x: number; y: number };
  active: boolean;
}

export const SharedWorkspace = ({ documentId }: { documentId: string }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [content, setContent] = useState('');
  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/collaboration`, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    newSocket.emit('join_document', { documentId, user });

    newSocket.on('document_state', (initialContent: string) => {
      setContent(initialContent);
    });

    newSocket.on('user_joined', (users: CollaborationUser[]) => {
      setActiveUsers(users);
    });

    newSocket.on('content_change', (newContent: string) => {
      setContent(newContent);
    });

    newSocket.on('cursor_move', (userData: CollaborationUser) => {
      setActiveUsers(prev => 
        prev.map(u => u.id === userData.id ? { ...u, cursor: userData.cursor } : u)
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave_document', { documentId, user });
      newSocket.disconnect();
    };
  }, [documentId, user]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket?.emit('content_change', { documentId, content: newContent });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cursor = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    socket?.emit('cursor_move', { documentId, cursor });
  };

  return (
    <div className="shared-workspace">
      <div className="active-users">
        {activeUsers.map(user => (
          <div key={user.id} className="user-indicator">
            <span className="user-name">{user.name}</span>
            <div 
              className="cursor-indicator"
              style={{
                left: user.cursor?.x,
                top: user.cursor?.y,
              }}
            />
          </div>
        ))}
      </div>

      <div className="editor-container" onMouseMove={handleMouseMove}>
        <textarea
          value={content}
          onChange={handleContentChange}
          className="collaborative-editor"
        />
      </div>
    </div>
  );
};
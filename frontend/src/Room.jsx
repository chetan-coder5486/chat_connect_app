import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import './Room.css';

function Room() {
  const { id: room } = useParams();
  const { username } = useContext(AuthContext);
  const navigate = useNavigate();

  const socketRef = useRef(null);

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    // Connect socket only once
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000');
    }

    const socket = socketRef.current;

    // Join room
    socket.emit('join-room', room);

    // Room not found
    socket.on('error-room-not-found', (roomCode) => {
      alert(`❌ Room with code ${roomCode} does not exist!`);
      navigate('/');
    });

    // Incoming messages from server
    socket.on('chat-message', (data) => {
      const formatted = {
        username: data.username,
        message: data.content,
        time: new Date(data.timestamp).toLocaleTimeString(),
      };
      setChat((prev) => [...prev, formatted]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [room, username, navigate]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [chat]);

  const sendMessage = () => {
    const socket = socketRef.current;

    if (message.trim() && socket) {
      const msgData = {
        username,
        content: message,
        roomCode: room,
      };

      socket.emit('chat-message', msgData); // Send to server only
      setMessage('');
    }
  };

  return (
    <div className="chat-box">
      <h2>Room ID: {room}</h2>
      <div className="messages" ref={chatBoxRef}>
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`message-bubble ${
              msg.username === username ? 'sent' : 'received'
            }`}
          >
            <div className="bubble-header">
              <span className="msg-user">{msg.username}</span>
              <span className="msg-time">{msg.time}</span>
            </div>
            <div className="msg-text">{msg.message}</div>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          className="input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Room;

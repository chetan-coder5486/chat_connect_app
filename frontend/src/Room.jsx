import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import './Room.css';

const socket = io('http://localhost:3001');

function Room() {
  const { id: room } = useParams();
  const { username } = useContext(AuthContext);
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!username) {
      // If user directly opens /room/:id without entering name, redirect to home
      navigate('/');
      return;
    }

    socket.emit('join_room', { username, room });

    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [room, username, navigate]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [chat]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        username,
        room,
        message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', msgData);
      setChat((prev) => [...prev, msgData]);
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

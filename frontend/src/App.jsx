import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  const joinRoom = () => {
    if (username && room) {
      socket.emit('join_room', { username, room });
      setJoined(true);
    }
  };

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

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [chat]);

  return (
    <div className="container">
      {!joined ? (
        <div className="form">
          <h2 className="title">Join a Chat Room</h2>

          <div className="field">
            <label htmlFor="username" className="label">Username</label>
            <input
              id="username"
              className="input"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="room" className="label">Chat Room ID</label>
            <input
              id="room"
              className="input"
              placeholder="Enter room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          <button className="btn" onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div className="chat-box">
          <h2>Room: {room}</h2>

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
      )}
    </div>
  );
}

export default App;

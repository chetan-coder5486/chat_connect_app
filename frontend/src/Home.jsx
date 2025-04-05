import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Home.css';

function Home() {
  const { username, setUsername } = useContext(AuthContext);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  const createRoom = () => {
    if (!username) {
      alert('Please enter your name first');
      return;
    }
    const newRoomId = Math.floor(100000 + Math.random() * 900000);
    navigate(`/room/${newRoomId}`);
  };

  const handleJoin = () => {
    if (!username) {
      alert('Please enter your name first');
      return;
    }
    if (roomId.trim() === '') {
      setShowJoinInput(true);
      return;
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Chat Connect</h1>

      <input
        className="input"
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div className="home-options">
        <button className="home-btn" onClick={createRoom}>Create Room</button>

        {showJoinInput ? (
          <div style={{ marginTop: '10px' }}>
            <input
              className="input"
              type="number"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button className="home-btn" onClick={handleJoin}>Join Now</button>
          </div>
        ) : (
          <button className="home-btn" onClick={handleJoin}>Join Room</button>
        )}
      </div>
    </div>
  );
}

export default Home;

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Home.css';

function Home() {
  const { username, setUsername } = useContext(AuthContext);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  const createRoom = async () => {
    if (!username.trim()) {
      alert('Please enter your name first');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      navigate(`/room/${data.roomCode}`);
    } catch (err) {
      console.error(err);
      alert('Something went wrong while creating the room');
    }
  };

  const handleJoin = async () => {
    if (!username.trim()) {
      alert('Please enter your name first');
      return;
    }

    if (!/^\d{6}$/.test(roomId)) {
      alert('Please enter a valid 6-digit Room ID');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/rooms/join/${roomId}`);
      if (!res.ok) {
        throw new Error('Room not found');
      }

      navigate(`/room/${roomId}`);
    } catch (err) {
      alert(`❌ Room with code ${roomId} does not exist!`);
    }
  };

  return (
    <div className="home-wrapper">
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

          <button className="home-btn" onClick={() => setShowJoinInput(true)}>
            Join Room
          </button>

          {showJoinInput && (
            <div style={{ marginTop: '10px' }}>
              <input
                className="input"
                type="number"
                placeholder="Enter 6-digit Room ID"
                value={roomId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 6) setRoomId(val);
                }}
              />
              <button className="home-btn" onClick={handleJoin}>Join Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

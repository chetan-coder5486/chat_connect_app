import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Options() {
  const navigate = useNavigate();
  const { username } = useContext(AuthContext);

  if (!username) {
    return <p>Please go to Home and enter your name.</p>;
  }

  const createRoom = () => {
    const roomId = Math.floor(100000 + Math.random() * 900000);
    navigate(`/room/${roomId}`);
  };

  const joinRoom = () => {
    navigate('/join');
  };

  return (
    <div className="home-container">
      <h2>Hello, {username}!</h2>
      <button className="home-btn" onClick={createRoom}>Create Room</button>
      <button className="home-btn" onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default Options;

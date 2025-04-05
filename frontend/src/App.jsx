import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Options from './Options';
import Room from './Room';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/options" element={<Options />} />
      <Route path="/room/:id" element={<Room />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

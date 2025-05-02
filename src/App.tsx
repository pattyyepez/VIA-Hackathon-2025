import React, { useState } from 'react';
import CanvasView from './components/CanvasView';

type Thought = {
  x: number;
  y: number;
  text: string;
};

const App: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newText, setNewText] = useState('');

  const addThought = (text: string) => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 300 + Math.random() * 100;
    const newThought = {
      x: window.innerWidth / 2 + Math.cos(angle) * radius,
      y: window.innerHeight / 2 + Math.sin(angle) * radius,
      text,
    };
    setThoughts((prev) => [...prev, newThought]);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <input
        type="text"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && newText.trim()) {
            addThought(newText.trim());
            setNewText('');
          }
        }}
        placeholder="What are you thinking..."
        style={{
          position: 'absolute',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          padding: '12px 16px',
          fontSize: '21px',
          border: 'none',
          outline: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          color: '#333',
          borderRadius: '12px',
          textAlign: 'center',
          fontFamily: 'Arial',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
        }}
      />
      <CanvasView thoughts={thoughts} />
    </div>
  );
  
};

export default App;

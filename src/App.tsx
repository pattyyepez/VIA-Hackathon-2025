import React, { useState } from 'react';
import CanvasView from './components/CanvasView';
import ThoughtForm from './components/ThoughtForm';

type Thought = {
  x: number;
  y: number;
  text: string;
};

const App: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newText, setNewText] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [activeThought, setActiveThought] = useState<Thought | null>(null);

  const addThought = (text: string) => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 300 + Math.random() * 100;
    const newThought = {
      x: window.innerWidth / 2 + Math.cos(angle) * radius,
      y: window.innerHeight / 2 + Math.sin(angle) * radius,
      text,
    };
    setThoughts((prev) => [...prev, newThought]);
  
    setActiveThought(newThought);
    setTitle(text);
    setBody('');
    setFormOpen(true);
  };
  

  const handleThoughtClick = (thought: Thought) => {
    setActiveThought(thought);
    setTitle(thought.text);
    setBody('');
    setFormOpen(true);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          background: 'linear-gradient(115deg, rgba(255,255,255,0.9), rgba(255,192,203,0.5), rgba(173,216,230,0.3))',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        }}
      />

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
        placeholder="what are you thinking..."
        style={{
          position: 'absolute',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          padding: '12px 16px',
          fontSize: '21px',
          border: 'none',
          outline: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          color: '#333',
          borderRadius: '12px',
          textAlign: 'left',
          fontFamily: 'Helvetica',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <CanvasView thoughts={thoughts} onThoughtClick={handleThoughtClick} />
      </div>

      {formOpen && (
        <ThoughtForm
          title={title}
          body={body}
          setTitle={setTitle}
          setBody={setBody}
          onClose={() => setFormOpen(false)}
          onSubmit={() => {
            alert(`AI:\nTitle: ${title}\nBody: ${body}`);
            setFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default App;

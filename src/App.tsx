import React, { useState, useRef, useEffect } from 'react';
import CanvasView from './components/CanvasView';
import ThoughtForm from './components/ThoughtForm';

type Thought = {
  x: number;
  y: number;

  id: string;

  title: string;
  content: string;

  output: string;
};

const App: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newText, setNewText] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [activeThought, setActiveThought] = useState<Thought | null>(null);
  const [isListening, setIsListening] = useState(false); // <== MISSING
  const recognitionRef = useRef<any>(null);

    useEffect(() => {
      fetch("https://localhost:7071/Thought/")
      .then(response => response.json())
      .then(data => data.reduce((acc : Thought[], cur : any) => {
        acc.push(cur as Thought);
        return acc;
      }, []))
      .then(setThoughts)
      .catch(console.log);

      console.log(thoughts);

    }, []);
      
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                finalTranscript += result[0].transcript;
            }
            setNewText(finalTranscript);
        };

        recognition.onerror = (e: any) => console.error('Speech error:', e.error);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;

        return () => recognition.stop();
    }, []);
      
   const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (!isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        } else {
            recognitionRef.current.stop();
            setIsListening(false);
        }
   };
     
   
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newText.trim()) {
            addThought(newText.trim());
            setNewText('');
        }
    };

    const handleArrowClick = () => {
        if (newText.trim()) {
            addThought(newText.trim()); // This will add the new thought to the bubbles
            setNewText(''); // Optionally clear the input after sending the thought
        }
    };
   
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewText(e.target.value);
   };

  const addThought = async (text: string) => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 300 + Math.random() * 100;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text, content: '' })
    };

    const response = await fetch('https://localhost:7071/Thought', requestOptions);
    const data = await response.json();
    setActiveThought(data);

      const newThought = {
        x: window.innerWidth / 2 + Math.cos(angle) * radius,
        y: window.innerHeight / 2 + Math.sin(angle) * radius,
        title: text,
        id: data.id,
        content: '',
        output: ''
      };

    setThoughts((prev) => [...prev, newThought]);
  
    setActiveThought(newThought);
    setTitle(text);
    setBody('');
    setFormOpen(true);
  };

  const updateThought = ( id: string, title: string, content: string ) => {

    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, title: title, content: content })
    };

    fetch('https://localhost:7071/Thought', requestOptions)
      .then(response => response.json())
      .catch(console.log);
    
    var thoughtsToUpdate = thoughts;
    thoughtsToUpdate = thoughtsToUpdate.map(elem => {
      if(id == elem.id){
        return {...elem, title: title, content: content}
      }
      return elem;
    });
    setThoughts(thoughtsToUpdate);
  
    setFormOpen(false);
  };

  const handleThoughtClick = (thought: Thought) => {
    setActiveThought(thought);
    setTitle(thought.title);
    setBody(thought.content);
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
      
      <div
          style={{
                    position: 'absolute',
                    top: '90px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    width: '500px',
                    zIndex: 100,
                    borderRadius: '12px', // Rounded corners for the whole container
                    overflow: 'hidden', // Ensures the buttons stay inside the container
                    border: '1px solid rgba(0,0,0,0.1)', // Optional: Add a light border
                }}
      >

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
                    placeholder="What are you thinking?"
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        fontSize: '21px',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        color: '#333',
                        fontFamily: 'Helvetica',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(6px)',
                    }}
         />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
                    <button
                        onClick={toggleListening}
                        style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s ease-in-out',
                            ...(isListening ? { transform: 'scale(1.2)' } : {}),
                        }}
                        title={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        <img
                            src="/micro.png"
                            alt="Mic"
                            style={{
                                width: '24px',
                                height: '24px',
                                ...(isListening ? { animation: 'pulse 1s infinite' } : {}),
                            }}
                        />
                    </button>
                    <button
                        onClick={handleArrowClick}
                        style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title="Send thought"
                    >
                        <img src="/arrow.png" alt="Arrow" style={{ width: '40px', height: '40px' }} />
                    </button>
                </div>
            </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <CanvasView thoughts={thoughts} onThoughtClick={handleThoughtClick} />
      </div>

      {formOpen && (
        <ThoughtForm
          title={title}
          body={body}
          output={activeThought!.output}
          setTitle={setTitle}
          setBody={setBody}
          onClose={ () => updateThought(activeThought!.id, title, body)}
          onSubmit={ async () => {
            console.log("heres this: " + activeThought!.id);
            fetch('https://localhost:7071/Prompt', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ id : activeThought!.id })
            })
            .then(console.log)
            .catch(console.log);
            setFormOpen(false);
          } }
        />
      )}
    </div>
  );
};

export default App;

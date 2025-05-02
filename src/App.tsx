import React, { useState, useEffect, useRef } from 'react';
import CanvasView from './components/CanvasView';

type Thought = {
    x: number;
    y: number;
    text: string;
};

const App: React.FC = () => {
    const [thoughts, setThoughts] = useState<Thought[]>([]);
    const [newText, setNewText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Función para agregar una nueva burbuja de pensamiento
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

    useEffect(() => {
        // Verificar si el navegador soporta el reconocimiento de voz
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
                const transcript = result[0].transcript;
                if (result.isFinal) {
                    finalTranscript += transcript;
                } else {
                    finalTranscript += transcript;
                }
            }
            setNewText(finalTranscript); // Mostrar la transcripción en el campo de texto
        };

        recognition.onerror = (e: any) => {
            console.error('Speech recognition error:', e.error);
        };

        recognition.onend = () => {
            setIsListening(false); // Detener la escucha cuando el reconocimiento termine
        };

        recognitionRef.current = recognition;

        // Cleanup
        return () => {
            recognition.stop();
        };
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (!isListening) {
            recognitionRef.current.start(); // Iniciar el reconocimiento
            setIsListening(true);
        } else {
            recognitionRef.current.stop(); // Detener el reconocimiento
            setIsListening(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewText(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newText.trim()) {
            // Enviar el texto como una burbuja de pensamiento
            addThought(newText.trim());
            setNewText(''); // Limpiar el campo de texto
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {/* 🌈 Fondo de gradiente */}
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

            {/* 📝 Entrada de texto con el botón del micrófono */}
            <div
                style={{
                    position: 'absolute',
                    top: '90px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    width: '500px',
                    zIndex: 100,
                }}
            >
                <input
                    type="text"
                    value={newText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="What are you thinking?"
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        fontSize: '21px',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        color: '#333',
                        borderRadius: '12px 0 0 12px',
                        fontFamily: 'Helvetica',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(6px)',
                    }}
                />
                <button
                    onClick={toggleListening}
                    style={{
                        width: '60px',
                        backgroundColor: isListening ? '#FF5733' : '#4CAF50',
                        border: 'none',
                        borderRadius: '0 12px 12px 0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                    }}
                    title={isListening ? 'Stop listening' : 'Start listening'}
                >
                    <img src="/micro.png" alt="Mic" style={{ width: '24px', height: '24px' }} />
                </button>
            </div>

            {/* 🧠 Burbuja de pensamientos */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <CanvasView thoughts={thoughts} />
            </div>
        </div>
    );
};

export default App;

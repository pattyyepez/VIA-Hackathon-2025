import React from 'react';

type ThoughtFormProps = {
  title: string;
  body: string;
  setTitle: (val: string) => void;
  setBody: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const ThoughtForm: React.FC<ThoughtFormProps> = ({
  title,
  body,
  setTitle,
  setBody,
  onClose,
  onSubmit,
}) => {
  return (
    <div
  style={{
    position: 'fixed',
    top: '50%',
    right: '40px',
    transform: 'translateY(-50%)',
    width: '350px', 
    height: '650px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '24px',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#333',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(8px)',
    zIndex: 100,
  }}
>

      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 12,
          right: 16,
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#666',
        }}
      >
        ✕
      </button>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: '90%',
          marginBottom: '12px',
          padding: '12px 16px',
          fontSize: '21px',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: '#333',
          borderRadius: '12px',
          textAlign: 'left',
          fontFamily: 'Helvetica',
          fontWeight: 'bold',
        }}
      />

      <textarea
        placeholder="Continue with your thought..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        style={{
          width: '90%',
          height: '450px',
          marginBottom: '16px',
          padding: '12px 16px',
          fontSize: '18px',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: '#333',
          borderRadius: '12px',
          textAlign: 'left',
          fontFamily: 'Helvetica',
          resize: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      />

      <button
        onClick={onSubmit}
        style={{
          width: 'auto',
          padding: '12px 16px',
          fontSize: '18px',
          border: 'none',
          backgroundColor: '#6c757d',
          color: 'white',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        AI Help ✨
      </button>
    </div>
  );
};

export default ThoughtForm;

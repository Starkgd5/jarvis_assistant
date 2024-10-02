import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Jarvis = () => {
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/conversations/', { message: input });
      setConversations([...conversations, response.data]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Aqui você implementaria a lógica de reconhecimento de voz
  };

  return (
    <div className="flex flex-col h-screen bg-jarvis-dark text-white">
      <div className="flex-1 overflow-auto p-4">
        {conversations.map((conv) => (
          <div key={conv.id} className="mb-4">
            <p className="text-jarvis-blue">You: {conv.message}</p>
            <p>Jarvis: {conv.response}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-jarvis-dark">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded-l bg-gray-700 text-white"
            placeholder="Ask Jarvis..."
          />
          <button type="submit" className="bg-jarvis-blue p-2 rounded-r">
            Send
          </button>
          <button
            type="button"
            onClick={toggleListening}
            className={`ml-2 p-2 rounded ${isListening ? 'bg-red-500' : 'bg-green-500'}`}
          >
            {isListening ? 'Stop' : 'Listen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Jarvis;
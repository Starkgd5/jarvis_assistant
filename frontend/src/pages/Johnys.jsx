import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader } from 'lucide-react';

export default function ImprovedChat() {
  const [query, setQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversations]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const newConversation = { id: Date.now(), query: { question: query }, type: 'user' };
    setConversations(prev => [...prev, newConversation]);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/queries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });
      
      if (!response.ok) throw new Error('Falha na requisição');
      
      const data = await response.json();
      setConversations(prev => [...prev, { ...data, type: 'assistant' }]);
    } catch (error) {
      console.error('Erro:', error);
      setConversations(prev => [...prev, { id: Date.now(), text: 'Desculpe, ocorreu um erro.', type: 'error' }]);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {conversations.map((conv) => (
          <div key={conv.id} className={`max-w-[80%] ${conv.type === 'user' ? 'ml-auto bg-blue-600' : 'mr-auto bg-gray-700'} rounded-lg p-3`}>
            <p className={conv.type === 'user' ? 'text-white' : 'text-gray-200'}>
              {conv.type === 'user' ? conv.query.question : conv.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-800 flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-2 rounded-l bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-500 p-2 rounded-r hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? <Loader className="animate-spin" /> : <Send />}
        </button>
      </form>
    </div>
  );
}
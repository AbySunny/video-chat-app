import React, { useState } from 'react';
import axios from 'axios';

const AiPage = () => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse(''); // Clear previous response

    try {
        const response = await axios.post('http://localhost:5001/api/ai/chat', { prompt: userInput });
        setAiResponse(response.data.response);
    } catch (error) {
      console.error('Error communicating with backend: ', error);
      setAiResponse('Error getting response from AI.');
    } finally {
      setLoading(false);
      setUserInput(''); // Clear input field after submission
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Chat</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
          className="border rounded-md py-2 px-3 w-full"
        />
        <button
          type="submit"
          disabled={loading || !userInput.trim()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
      {aiResponse && (
        <div className="bg-gray-100 rounded-md p-4">
          <p className="font-semibold">AI Response:</p>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default AiPage;
const AiPageFrontEnd = () => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse(''); // Clear previous response

    try {
      // Mock AI response for frontend demonstration
      // In a real application, you would integrate with a client-side AI library or API
      const mockResponse = `You asked: "${userInput}".  This is a simulated AI response.  For a real AI interaction, a backend with an AI model is required.`;
      setAiResponse(mockResponse);
    } catch (error) {
      console.error('Error simulating AI response:', error);
      setAiResponse('Error simulating AI response.');
    } finally {
      setLoading(false);
      setUserInput(''); // Clear input field after submission
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Chat (Frontend Simulation)</h1>
      <p className="mb-4 text-gray-700">
        This is a frontend simulation of an AI chat.  For real AI functionality, a backend with an AI model integration is necessary.
      </p>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
          className="border rounded-md py-2 px-3 w-full"
        />
        <button
          type="submit"
          disabled={loading || !userInput.trim()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
      {aiResponse && (
        <div className="bg-gray-100 rounded-md p-4">
          <p className="font-semibold">Simulated AI Response:</p>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export { AiPage, AiPageFrontEnd };

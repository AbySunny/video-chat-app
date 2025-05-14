import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const originalInput = input; // Keep the original input for display
    let messageToSendToRasa = originalInput;

    const userMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      text: originalInput
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Check if the message starts with @rasa
    if (originalInput.toLowerCase().startsWith('@rasa ')) {
      // Remove "@rasa " from the message before sending to the backend
      messageToSendToRasa = originalInput.substring(6); // Length of "@rasa "

      if (messageToSendToRasa.trim() !== '') { // Ensure there's content after @rasa
        setIsLoading(true);
       // Inside Chat.jsx
// ...
try {
  // This is the attempt to communicate with Rasa
  const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: 'user', message: messageToSendToRasa }),
  });
  
  const data = await response.json(); // This can also throw an error if the response isn't valid JSON
  console.log("Rasa response:", data); // <<< THIS LINE IS VERY IMPORTANT FOR DEBUGGING
  // ...
} catch (error) { // If any error happens in the try block, this catch block is executed
  console.error("Rasa fetch error:", error); // <<< THIS LINE IS VERY IMPORTANT FOR DEBUGGING
  // The line you're seeing in your console:
  console.error("AI: Sorry, I encountered an issue trying to respond. Please try again.");
  setMessages((prevMessages) => [
    ...prevMessages,
    // This is the message displayed in the Chat.jsx UI
    { sender: 'bot', text: 'Sorry, I had trouble reaching the AI assistant.' }
  ]);
}
// ...

        
        finally {
          setIsLoading(false);
        }
      }
    }
     setInput('');
   };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    // Consider adding a wrapper div here for overall chat styling and positioning
    <div>
      {/* This div should be styled to be scrollable, e.g., height, overflow-y: auto */}
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
        disabled={isLoading}
      />
      <button onClick={sendMessage} disabled={isLoading}>{isLoading ? 'Sending...' : 'Send'}</button>
    </div>
  );
};

export default Chat;

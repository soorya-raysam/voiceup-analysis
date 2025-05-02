import React, { useEffect, useState } from 'react';
import { getConversations, analyzeConversation } from '../api/api';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    getConversations()
      .then((res) => setConversations(res.data))
      .catch((err) => console.error("API call failed:", err));
  }, []);

  const handleAnalyze = async (id) => {
    await analyzeConversation(id);
    alert('Analysis done! View in dashboard');
  };

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '100px',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Conversations
        </h1>

        {conversations.length === 0 && <p>No conversations found.</p>}

        {conversations.map((conv) => (
          <div
            key={conv.conversation_id}
            style={{
              backgroundColor: '#ffffff20',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              maxWidth: '600px',
            }}
          >
            <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>
              Conversation ID: {conv.conversation_id}
            </h3>
            {conv.messages.map((msg, i) => (
              <p key={i}>
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            ))}
            <button
              onClick={() => handleAnalyze(conv.conversation_id)}
              style={{
                marginTop: '12px',
                padding: '6px 12px',
                backgroundColor: '#2563eb',
                color: '#fff',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Analyze
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;

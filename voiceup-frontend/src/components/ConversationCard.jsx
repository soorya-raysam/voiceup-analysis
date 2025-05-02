import React from 'react';

const ConversationCard = ({ conversation, onAnalyze }) => {
  return (
    <div className="border p-4 rounded-lg mb-4 shadow-md bg-white">
      <h3 className="font-bold mb-2">Conversation ID: {conversation.conversation_id}</h3>
      {conversation.messages.map((msg, idx) => (
        <p key={idx}>
          <span className="font-semibold">{msg.sender}: </span>{msg.text}
        </p>
      ))}
      <button
        className="mt-3 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
        onClick={() => onAnalyze(conversation.conversation_id)}
      >
        Analyze
      </button>
    </div>
  );
};

export default ConversationCard;

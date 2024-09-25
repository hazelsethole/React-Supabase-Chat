import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*');
      setMessages(data);
    };

    fetchMessages();

    const messageSubscription = supabase
      .from('messages')
      .on('INSERT', (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(messageSubscription);
    };
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await supabase.from('messages').insert([{ content: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index}>{message.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;


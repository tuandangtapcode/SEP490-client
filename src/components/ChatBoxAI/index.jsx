import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, List, Typography } from 'antd';
import ChatBoxAiService from 'src/services/ChatBoxAI';

const { TextArea } = Input;
const { Text } = Typography;

const ChatBoxAI = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await ChatBoxAiService.generateText(prompt);
      const reply = response.data.data; // Assuming the response structure has a data field for the text

      setMessages([...messages, { type: 'user', text: prompt }, { type: 'bot', text: reply }]);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      setMessages([...messages, { type: 'error', text: 'An error occurred. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
      <List
        bordered
        dataSource={messages}
        renderItem={(item) => (
          <List.Item>
            <Text strong={item.type === 'user'} type={item.type === 'error' ? 'danger' : 'default'}>
              {item.type === 'user' ? 'You: ' : item.type === 'bot' ? 'AI: ' : ''}
              {item.text}
            </Text>
          </List.Item>
        )}
      />
      <TextArea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your prompt here..."
        style={{ marginTop: '10px' }}
      />
      <Button type="primary" onClick={handleSend} loading={loading} style={{ marginTop: '10px' }}>
        Send
      </Button>
    </div>
  );
};

export default ChatBoxAI;
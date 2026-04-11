import React, { useState } from 'react';
import ChatIcon from './ChatIcon';
import ChatWindow from './ChatWindow';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatIcon onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default Chatbot;
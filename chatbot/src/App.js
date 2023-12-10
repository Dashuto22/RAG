import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [allBooksSelected, setAllBooksSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChitChatFlag, setIsChitChatFlag] = useState(false);
  let globalChitChatFlag = false;

  const addMessage = async () => {
    const userMessage = { content: newMessage, sender: 'user' };
    const updatedMessages = [...messages, userMessage];
    console.log('updated messages : ', updatedMessages);
    setMessages(updatedMessages);
    setNewMessage('');
    console.log('in add message : ', messages)
  }

  const getChitChatResponse = async () => {
    let responseText;
    try {
      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: newMessage
        }),
      }).then(response => response.json())
        .then(data => {
          console.log('response', data['generated_rerereresponse']);
          responseText = data['generated_rerereresponse'];
          const userMessage = { content: newMessage, sender: 'user' };
          const botMessage = { content: responseText, sender: 'bot' };
          const updatedMessages = [...messages, userMessage, botMessage];
          setMessages(updatedMessages);
          console.log('response added : ', messages)
        });;
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSendMessage = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (newMessage.trim() === '') return;
    await addMessage()
    const flag = await isChitChat()
    console.log('globalChitChatFlag : ', globalChitChatFlag)
    if (globalChitChatFlag) {
      console.log('this is chit chat!')
      await getChitChatResponse()
    } else {
      console.log('this is a novel question!')
    }
  };

  const isChitChat = async (e) => {
    try {
      console.log('in is chit chat')
      const response = await fetch('http://127.0.0.1:5000/chitchatclassifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: newMessage
        }),
      }).then(response => response.json())
        .then(data => {
          console.log('isChitChat response', data['isChitchat']);
          const chitChatFlag = data['isChitchat'];
          console.log('chitChatFlag : ', chitChatFlag)
          if (chitChatFlag === '1') {
            console.log('in here')
            globalChitChatFlag = true;
          } else {
            console.log('out here')
            globalChitChatFlag = false;
          }
          return chitChatFlag;
        });;
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
    }
  };

  const handleBookCheckboxChange = (book) => {
    const updatedSelectedBooks = selectedBooks.includes(book)
      ? selectedBooks.filter((selectedBook) => selectedBook !== book)
      : [...selectedBooks, book];

    setSelectedBooks(updatedSelectedBooks);
  };

  const handleSelectAllBooks = () => {
    if (allBooksSelected) {
      setAllBooksSelected(false);
      setSelectedBooks([]);
    } else {
      const allBooks = [
        'The Adventures of Sherlock Holmes',
        'Alice\'s Adventures in Wonderland',
        'Great Expectations',
        'Into the Primitive',
        'Pride and Prejudice',
        'Ramayana',
        'The Great Gatsby',
        'The Jungle Book',
        'War and Peace',
        'Warrior of Two Worlds',
      ];
      setSelectedBooks(allBooks);
      setAllBooksSelected(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ChatGenix Bot</h1>
      </header>
      <div className="App-content">
        <div className="ChatContainer">
          <div className="MessageList">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`Message ${message.sender === 'user' ? 'UserMessage' : 'BotMessage'}`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="MessageInputContainer">
            <form>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ width: '300px' }}
              />
              <button style={{ width: '60px' }} type='submit' onClick={handleSendMessage} disabled={loading} >{loading ? 'Loading' : 'Send'}</button>
            </form>
          </div>
        </div>
        <div className="BookSelectionContainer">
          <h2>Topic Selection</h2>
          <div>
            {[
              'The Adventures of Sherlock Holmes',
              'Alice\'s Adventures in Wonderland',
              'Great Expectations',
              'Into the Primitive',
              'Pride and Prejudice',
              'Ramayana',
              'The Great Gatsby',
              'The Jungle Book',
              'War and Peace',
              'Warrior of Two Worlds',
            ].map((book, index) => (
              <div key={index} className="CheckboxContainer">
                <input
                  type="checkbox"
                  id={book}
                  checked={selectedBooks.includes(book)}
                  onChange={() => handleBookCheckboxChange(book)}
                />
                <label htmlFor={book}>{book}</label>
              </div>
            ))}
          </div>
          <br></br><br></br>
          <div className="CheckboxContainer">
            <input type="checkbox" id="selectAll" onChange={handleSelectAllBooks} />
            <label htmlFor="selectAll">Select All</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
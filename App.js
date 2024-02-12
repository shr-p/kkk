import React,{useState,useEffect} from 'react';
import './App.css';
import axios from 'axios';
import sendBtn from './send.svg';
function App() {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {

    const savedSessions = JSON.parse(localStorage.getItem('sessions')) || [];
    setSessions(savedSessions);
  }, []);

  useEffect(() => {
  
    if (currentSession) {
      setQuestion(''); 
    }
  }, [currentSession]);
  const createSession = () => {
    const uniqueNumber = Math.floor(Math.random() * 90) + 10;

    const newSession = {
        id: uniqueNumber,
        work: 0,
    };
    setSessions([...sessions, newSession]);
    setCurrentSession(newSession);
  };
  const updateWorkInSession = (amount) => {
    if (currentSession) {
      const updatedSessions = sessions.map((session) =>
        session.id === currentSession.id ? { ...session, work: session.work + amount } : session
      );
      setSessions(updatedSessions);
      saveSessions(updatedSessions);
    }
  };
  const handleSessionClick = (session) => {
    setCurrentSession(session);
  };

  const deleteSession = (sessionID) => {
    const updatedSessions = sessions.filter((session) => session.id !== sessionID);
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    localStorage.removeItem(`messages-${sessionID}`);
    setCurrentSession(null);
  };
  const saveSessions = (updatedSessions) => {
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
  };
  const saveMessages = (sessionID, messages) => {
    localStorage.setItem(`messages-${sessionID}`, JSON.stringify(messages));
  };

  const loadMessages = (sessionID) => {
    return JSON.parse(localStorage.getItem(`messages-${sessionID}`)) || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      if (!question) {
        setError('Please enter a question.');
        setIsLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/ask', { question });

      if (response.status === 200) {
        const data = response.data;
        const newMessage = { question, answer: data.answer, isAnswer: true };

        if (currentSession) {
          const updatedMessages = [...loadMessages(currentSession.id), newMessage];
          saveMessages(currentSession.id, updatedMessages);
          setCurrentSession({ ...currentSession, messages: updatedMessages });
          updateWorkInSession(1);
        }

        setQuestion('');
      } else {
        setError('Server error: Unexpected status code ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const messages = currentSession ? loadMessages(currentSession.id) || [] : [];
  const deleteAllSessions = () => {
    setSessions([]);
    saveSessions([]);
    setCurrentSession(null);
  };
  const renameSession = (sessionID) => {
    const newSessionName = prompt('Enter new session name:');

    if (newSessionName !== null && newSessionName !== '') {
      const updatedSessions = sessions.map((session) =>
        session.id === sessionID ? { ...session, name: newSessionName } : session
      );

      setSessions(updatedSessions);
      saveSessions(updatedSessions);
    }
  };

  return (
    <div className="App">
      <div className='header'>AZURE CSAT PROTOTYPE</div>
      <div className='content'>
      <div className='sidebar'>HISTORY
        <div className='upperside'>
        <div className="new-chat-btn " onClick={createSession}>+ NEW CHAT</div>
        <div className="session-list">
            <ul >
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className={currentSession && currentSession.id === session.id ? 'active' : ''}
                  onClick={() => handleSessionClick(session)}
                >
                  <span
                      onClick={() => handleSessionClick(session)}
                      contentEditable={true}
                      onBlur={(e) => {
                        const newName = e.target.innerText.trim();
                        if (newName !== '' && newName !== session.name) {
                          const updatedSessions = sessions.map((s) =>
                            s.id === session.id ? { ...s, name: newName } : s
                          );
                          setSessions(updatedSessions);
                          saveSessions(updatedSessions);
                        }
                      }}
                    >
                      {session.name || `Session ${session.id}`}
                    </span>
                    <button onClick={() => renameSession(session.id)}>R</button>
                    <button onClick={() => deleteSession(session.id)}>D</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='lowerside'>
          <div className='chathistory' onClick={deleteAllSessions}>CHAT HISTORY |D|</div>
          <div className='useraccount'>USER ACCOUNT</div>
        </div>
      </div>
      <div className='main'>
      <div className="chat-body">
              {messages.map((message, index) => (
                <div className="message" key={index}>
                  <div className={`message ${message.isAnswer ? 'questionss' : ''}`}>
                    <div className="message1">
                    <div className={`icon question-icon`}></div>
                      <div className={`message question`}>{message.question}</div>
                    </div>
                  </div>
                  {message.isAnswer && (
                    <div className="message1">
                       <div className={`icon answer-icon`}></div>
                      <div className={`message answerrrrr`}>{message.answer}</div>
                    </div>
                  )}
                </div>
              ))}
              {error && (
                <div className="message error">
                  <p>{error}</p>
                </div>
              )}
            </div>
        <div className='chatfooter'>
          
          <form  className='inp' onSubmit={handleSubmit}>
            <input  type="text"
      value={question}
      onChange={handleInputChange}
      placeholder="Type your message..."
      required></input><button className='send'><img src={sendBtn} alt="send"></img></button>
      {isLoading && <span>Loading...</span>}
  </form>
          
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;

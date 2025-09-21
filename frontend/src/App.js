import React, { useEffect, useState, useRef } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const stored = localStorage.getItem('mm_session');
    if (stored) setSessionId(stored);
  }, []);

  const createSession = async () => {
    const resp = await fetch(`${API_URL}/api/session`, { method: 'POST' });
    const data = await resp.json();
    setSessionId(data.sessionId);
    localStorage.setItem('mm_session', data.sessionId);
  };

  if (!sessionId) {
    return <div className="app"><Login onCreate={createSession} /></div>;
  }

  return (
    <div className="app">
      <div className="topbar">
        <div className="header">
          <div className="title">MannMitra — AI Mental Wellness Companion</div>
        </div>
        <div>
          <label>
            Language:&nbsp;
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option>English</option>
              <option>Hindi</option>
              <option>Malayalam</option>
              <option>Tamil</option>
              {/* add more as you translate prompts */}
            </select>
          </label>
        </div>
      </div>

      <Chat apiUrl={API_URL} sessionId={sessionId} language={language} />
      <div className="small">Confidential & anonymized. Not a replacement for professional care.</div>
    </div>
  );
}

export default App;

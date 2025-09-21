import React, { useState, useEffect, useRef } from 'react';

export default function Chat({ apiUrl, sessionId, language }) {
  const [messages, setMessages] = useState([{ id: 'sys', from: 'bot', text: 'Hi — I\'m MannMitra. Tell me what\'s on your mind. I\'m here to listen.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef();

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: input, language })
      });
      const data = await resp.json();
      const botMsg = { id: 'bot_' + Date.now(), from: 'bot', text: data.reply || 'Sorry, I could not process that.' };
      setMessages(prev => [...prev, botMsg]);

      if (data.risk === 'high') {
        const alertText = `It looks like you may be going through severe distress. Please consider contacting a helpline:\n${data.helplines.map(h=>h.number+' ('+h.country+')').join('\n')}`;
        setMessages(prev => [...prev, { id:'alert_'+Date.now(), from:'bot', text: alertText, alert: true }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: 'bot_err', from: 'bot', text: 'Network error — please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div>
      <div className="chatbox" ref={chatRef}>
        {messages.map(m => (
          <div key={m.id} style={{ display:'flex', flexDirection:'column', marginBottom:8 }}>
            <div className={`msg ${m.from==='user' ? 'user' : 'bot'}`} >
              {m.text.split('\n').map((line,i)=>(<div key={i}>{line}</div>))}
            </div>
            {m.alert && <div className="alert">If you feel in immediate danger, contact local emergency services now.</div>}
          </div>
        ))}
      </div>

      <div className="controls">
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type how you feel... (press Enter to send)" rows={3} />
        <div style={{ width:140 }}>
          <button className="button" onClick={send} disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
        </div>
      </div>
    </div>
  );
}

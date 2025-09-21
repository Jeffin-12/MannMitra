import React from 'react';

export default function Login({ onCreate }) {
  return (
    <div className="app login">
      <h2>Welcome to MannMitra</h2>
      <p>Create an anonymous session to start — no email required.</p>
      <button className="button" onClick={onCreate}>Start Anonymous Session</button>
      <p className="small">This creates an anonymous ID stored only in your browser. Your conversations are stored without personal identifiers.</p>
    </div>
  );
}

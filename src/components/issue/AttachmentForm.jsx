// AttachmentForm.jsx
import React, { useState } from 'react';

export default function AttachmentForm({ issueId, onCreate }) {
  const [mode, setMode] = useState('file');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (mode === 'file' && !file) return setError('Select file.');
    if (mode === 'link' && !link.trim()) return setError('Enter URL.');

    setError('');
    await onCreate({ issueId, type: mode, file, link: link.trim() });
    setFile(null);
    setLink('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded space-y-3">
      <div className="flex gap-4">
        <button type="button" onClick={() => setMode('file')} className={`px-3 py-1 rounded ${mode==='file'?'bg-blue-600':'bg-gray-700'}`}>File</button>
        <button type="button" onClick={() => setMode('link')} className={`px-3 py-1 rounded ${mode==='link'?'bg-blue-600':'bg-gray-700'}`}>Link</button>
      </div>
      {mode==='file' ? (
        <input type="file" onChange={e=>setFile(e.target.files[0]||null)} />
      ) : (
        <input type="url" placeholder="https://..." value={link} onChange={e=>setLink(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"/>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full px-4 py-2 bg-green-600 rounded text-white">Add Attachment</button>
    </form>
  )
}

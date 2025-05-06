import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAttachments, createAttachment } from '../../redux/currentworkspace/currentWorkspaceThunk';

export default function AttachmentsSection({ issueId }) {
  const dispatch = useDispatch();
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('file');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAttachments = async () => {
      setLoading(true);
      const result = await dispatch(fetchAttachments(issueId));
      if (fetchAttachments.fulfilled.match(result)) {
        setAttachments(result.payload);
      }
      setLoading(false);
    };
    if (issueId) loadAttachments();
  }, [dispatch, issueId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if ((type === 'file' || type === 'image') && !file)
      return setError('Please select a file.');
    if (type === 'link' && !url.trim())
      return setError('Please provide a valid link.');
  
    setError('');
  
    const payload = new FormData();
    payload.append('type', type);
    if (type === 'link') payload.append('url', url);
    else payload.append('file', file);
  
    const result = await dispatch(
      createAttachment({ issueId, formData: payload })
    );
    if (createAttachment.fulfilled.match(result)) {
      setAttachments(prev => [result.payload, ...prev]);
      setFile(null);
      setUrl('');
    } else {
      const err = result.payload;
      setError(typeof err === 'string' ? err : JSON.stringify(err));
    }
  };

  const renderPreview = (att) => {
    if (att.type === 'image') {
      return (
        <a href={att.url} target="_blank" rel="noreferrer">
          <img src={att.url} alt="attachment" className="w-24 h-24 object-cover rounded" />
        </a>
      );
    }
    if (att.url.toLowerCase().endsWith('.pdf')) {
      return (
        <a href={att.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
          📄 View PDF
        </a>
      );
    }
    if (att.type === 'file') {
      const name = att.url.split('/').pop();
      return (
        <a href={att.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
          📎 {name}
        </a>
      );
    }
    // link
    return (
      <a href={att.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
        🔗 {att.url}
      </a>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-200 mb-3">Attachments</h3>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {attachments.length > 0 ? (
            attachments.map(att => (
              <li key={att.id} className="flex items-center gap-3 bg-gray-800 p-2 rounded">
                {renderPreview(att)}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">No attachments yet.</li>
          )}
        </ul>
      )}

      <form onSubmit={handleCreate} className="bg-gray-800 p-4 rounded space-y-3">
        <div className="flex gap-4">
          {['file', 'image', 'link'].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setType(opt);
                setError('');
              }}
              className={`px-3 py-1 rounded ${type === opt ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>

        {type === 'link' ? (
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        ) : (
          <input
            type="file"
            accept={type === 'image' ? 'image/*' : '*'}
            onChange={e => {
              setFile(e.target.files[0]);
              console.log('Selected file:', e.target.files[0]);
            }}
            className="text-white"
          />
        )}

        {error && (
          <p className="text-red-500">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </p>
        )}

        <button type="submit" className="w-full px-4 py-2 bg-green-600 rounded text-white">
          Add Attachment
        </button>
      </form>
    </div>
  );
}

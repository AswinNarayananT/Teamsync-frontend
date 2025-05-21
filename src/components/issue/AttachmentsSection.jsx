import React, { useEffect, useState,useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchAttachments, createAttachment, deleteAttachment } from '../../redux/currentworkspace/currentWorkspaceThunk';
import PdfViewer from './PdfViewer';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function AttachmentsSection({ issueId }) {
  const dispatch = useDispatch();
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedAttachmentId, setSelectedAttachmentId] = useState(null);

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

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

 const handleCreate = async (values, { setSubmitting, setFieldError, resetForm }) => {
  setSubmitting(true);

  const uploadQueue = [];

  try {
    if (values.type === 'link') {
      for (const link of values.urls) {
        const formData = new FormData();
        formData.append('type', 'link');
        formData.append('url', link);
        uploadQueue.push(formData);
      }
    } else {
      const selectedFiles = values.type === 'image' ? values.images : values.files;
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('type', values.type);
        formData.append('file', file);
        uploadQueue.push(formData);
      }
    }

    const uploadedAttachments = [];

    for (const payload of uploadQueue) {
      const result = await dispatch(createAttachment({ issueId, formData: payload }));
      if (createAttachment.fulfilled.match(result)) {
        uploadedAttachments.push(result.payload);
      } else {
        const err = result.payload;
        throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
      }
    }

    setAttachments(prev => [...uploadedAttachments, ...prev]);
    resetForm();
  } catch (err) {
    setFieldError('general', err.message || 'Upload failed. Please try again.');
  } finally {
    setSubmitting(false);
  }
};


const handleDeleteClick = (id) => {
  setSelectedAttachmentId(id);
  setDeleteConfirmOpen(true);
};

const confirmDelete = async () => {
  if (!selectedAttachmentId) return;

  try {
    const result = await dispatch(deleteAttachment(selectedAttachmentId));
    if (deleteAttachment.fulfilled.match(result)) {
      setAttachments(prev => prev.filter(att => att.id !== selectedAttachmentId));
    }
  } catch (error) {
    console.error('Failed to delete attachment:', error);
  } finally {
    setDeleteConfirmOpen(false);
    setSelectedAttachmentId(null);
  }
};

const cancelDelete = () => {
  setDeleteConfirmOpen(false);
  setSelectedAttachmentId(null);
};



  const openPreview = (att) => {
    setPreviewData(att);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewData(null);
  };

  const renderAttachmentThumbnail = (att) => {
    if (att.type === 'image') {
      return (
        <div 
          onClick={() => openPreview(att)} 
          className="relative w-16 h-16 bg-gray-700 rounded overflow-hidden cursor-pointer group"
        >
          <img src={att.url} alt="attachment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-white text-xs">Preview</span>
          </div>
        </div>
      );
    }
    
    if (att.url.toLowerCase().endsWith('.pdf')) {
      return (
        <div 
          onClick={() => openPreview(att)} 
          className="relative w-16 h-16 bg-gray-700 rounded overflow-hidden cursor-pointer group flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M9 15h6"></path>
            <path d="M9 18h6"></path>
            <path d="M9 12h6"></path>
          </svg>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-white text-xs">Preview</span>
          </div>
        </div>
      );
    }
    
    if (att.type === 'file') {
      const name = att.url.split('/').pop();
      return (
        <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
        </div>
      );
    }
    
    // link
    return (
      <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </div>
    );
  };

  const renderAttachmentInfo = (att) => {
    if (att.type === 'image') {
      const name = att.url.split('/').pop();
      return (
        <div className="flex flex-col">
          <span className="text-gray-200 font-medium text-sm">{name}</span>
          <span className="text-gray-400 text-xs">Image</span>
        </div>
      );
    }
    
    if (att.url.toLowerCase().endsWith('.pdf')) {
      const name = att.url.split('/').pop();
      return (
        <div className="flex flex-col">
          <span className="text-gray-200 font-medium text-sm">{name}</span>
          <span className="text-gray-400 text-xs">PDF Document</span>
        </div>
      );
    }
    
    if (att.type === 'file') {
      const name = att.url.split('/').pop();
      return (
        <div className="flex flex-col">
          <span className="text-gray-200 font-medium text-sm">{name}</span>
          <span className="text-gray-400 text-xs">File</span>
        </div>
      );
    }
    
    // link
    return (
      <div className="flex flex-col">
        <span className="text-gray-200 font-medium text-sm truncate max-w-xs">{att.url}</span>
        <span className="text-gray-400 text-xs">External Link</span>
      </div>
    );
  };
  
  // Preview Modal Component
  const PreviewModal = () => {
    if (!previewOpen || !previewData) return null;
  
    const isImage = previewData.type === 'image';
    const isPdf = previewData.url.toLowerCase().endsWith('.pdf');
    const filename = previewData.url.split('/').pop();
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-none shadow-2xl w-full h-full flex flex-col border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
            <h3 className="text-gray-200 font-medium flex items-center">
              {isImage && (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
              {isPdf && (
                <svg className="w-5 h-5 mr-2 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              )}
              <span className="truncate max-w-md">{filename}</span>
            </h3>
            <div className="flex items-center gap-2">
              <a 
                href={previewData.url} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-gray-100 transition-colors"
                title="Open in new tab"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <button 
                onClick={closePreview} 
                className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-gray-100 transition-colors"
                title="Close preview"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
  
          {/* Content */}
          <div className="flex-1 overflow-auto p-5 flex items-center justify-center">
            {isImage && (
              <img 
                src={previewData.url} 
                alt={filename} 
                className="max-w-full max-h-full object-contain"
              />
            )}
            {isPdf && (
              <div className="w-full h-full flex items-center justify-center">
                <PdfViewer pdfUrl={previewData.url} />
              </div>
            )}
          </div>
  
          {/* Footer */}
          <div className="flex justify-end items-center px-5 py-3 border-t border-gray-700">
            <button
              onClick={closePreview}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
        </svg>
        Attachments
      </h3>

      {loading ? (
        <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="mb-5">
          {attachments.length > 0 ? (
            <div className="space-y-3">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors border border-gray-700">
                  {renderAttachmentThumbnail(att)}
                  {renderAttachmentInfo(att)}
                  <div className="ml-auto flex gap-2">
                    <a 
                      href={att.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                      title="Open in new tab"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                    {(att.type === 'image' || att.url.toLowerCase().endsWith('.pdf')) && (
                      <button 
                        onClick={() => openPreview(att)} 
                        className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                        title="Preview"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    )}
                   <button
                      onClick={() => handleDeleteClick(att.id)}
                      className="p-2 rounded hover:bg-gray-700 text-red-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                      </svg>
                    </button>
                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-lg text-center border border-gray-700">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-gray-500 mb-2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
              </svg>
              <p className="text-gray-500 italic">No attachments yet.</p>
            </div>
          )}
        </div>
      )}

<Formik
  initialValues={{ type: 'file', url: '', urls: [], files: [], images: [] }}
  validationSchema={Yup.lazy(values => {
    switch (values.type) {
      case 'link':
        return Yup.object({
          type: Yup.string().required(),
          urls: Yup.array().min(1, 'Please add at least one link.')
        });
      case 'image':
        return Yup.object({
          type: Yup.string().required(),
          images: Yup.array()
            .min(1, 'Please select at least one image.')
            .test('fileSize', 'One or more images exceed 5MB', files =>
              files.every(file => file.size <= MAX_FILE_SIZE)
            )
        });
      case 'file':
      default:
        return Yup.object({
          type: Yup.string().required(),
          files: Yup.array()
            .min(1, 'Please select at least one file.')
            .test('fileSize', 'One or more files exceed 5MB', files =>
              files.every(file => file.size <= MAX_FILE_SIZE)
            )
        });
    }
  })}
  onSubmit={handleCreate}
>
  {({ values, setFieldValue, isSubmitting }) => (
    <Form className="bg-gray-800 p-5 rounded-lg border border-gray-700">
      <h4 className="text-gray-300 font-medium mb-3">Add New Attachments</h4>

      <div className="flex gap-3 mb-4">
        {['file', 'image', 'link'].map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => setFieldValue('type', opt)}
            className={`px-4 py-2 rounded-md transition-colors ${
              values.type === opt
                ? 'bg-purple-700 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>

      {values.type === 'link' ? (
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Add URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={values.url}
              onChange={e => setFieldValue('url', e.target.value)}
              placeholder="https://..."
              className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (values.url) {
                  setFieldValue('urls', [...values.urls, values.url]);
                  setFieldValue('url', '');
                }
              }}
              className="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded text-white"
            >
              Add
            </button>
          </div>
          <ErrorMessage name="urls" component="div" className="text-red-400 text-sm mt-1" />
          {values.urls.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-gray-300">
              {values.urls.map((u, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <a href={u} target="_blank" rel="noopener noreferrer" className="truncate">{u}</a>
                  <button
                    type="button"
                    onClick={() => setFieldValue('urls', values.urls.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-200 ml-2"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">
            {values.type === 'image' ? 'Upload Images' : 'Upload Files'}
          </label>
          <input
            type="file"
            accept={values.type === 'image' ? 'image/*' : '*'}
            multiple
            onChange={e => {
              const files = Array.from(e.target.files || []);
              if (values.type === 'image') {
                setFieldValue('images', [...values.images, ...files]);
              } else {
                setFieldValue('files', [...values.files, ...files]);
              }
            }}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
          <ErrorMessage name={values.type === 'image' ? 'images' : 'files'} component="div" className="text-red-400 text-sm mt-1" />
          {(values.type === 'image' ? values.images : values.files).length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-gray-300">
              {(values.type === 'image' ? values.images : values.files).map((file, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = (values.type === 'image' ? values.images : values.files).filter((_, i) => i !== idx);
                      values.type === 'image'
                        ? setFieldValue('images', newFiles)
                        : setFieldValue('files', newFiles);
                    }}
                    className="text-red-400 hover:text-red-200 ml-2"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-4 py-3 rounded-md text-white flex items-center justify-center ${
          isSubmitting
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-500'
        }`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Add Attachments
          </>
        )}
      </button>
    </Form>
  )}
</Formik>


      
      {/* Preview Modal */}
      <PreviewModal />

      <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this attachment? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelDelete} color="primary">
          Cancel
        </Button>
        <Button onClick={confirmDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>

    </div>
  );
}
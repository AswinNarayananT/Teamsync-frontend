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


export default PreviewModal
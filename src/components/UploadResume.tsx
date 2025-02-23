import { useState, useCallback } from 'react';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Allowed file types and max size (5MB)
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Validate file type and size
  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return "File type not supported. Please upload PDF or Word documents.";
    }
    if (file.size > maxSize) {
      return "File size exceeds 5MB limit.";
    }
    return null;
  };

  // Handle file selection or drop
  const handleFiles = useCallback((newFiles) => {
    const fileToUpload = newFiles[0]; // Only take the first file
    const error = validateFile(fileToUpload);

    if (error) {
      setError(error);
      return;
    }

    setFile(fileToUpload);
    setError(null);
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  }, [handleFiles]);

  // Handle drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Handle file input change
  const handleFileChange = useCallback((event) => {
    handleFiles(Array.from(event.target.files));
  }, [handleFiles]);

  // Handle file deletion
  const handleDelete = useCallback(() => {
    setFile(null);
  }, []);

  // Handle file preview in a new tab
  const handlePreview = useCallback(() => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank'); // Open in a new tab
    }
  }, [file]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <h2 className="text-xl font-semibold">Upload Resume</h2>
      </div>

      {/* Drag-and-drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Choose Resume
        </label>
        <p className="mt-2 text-sm text-gray-600">
          or drag and drop your resume here
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: PDF, DOC, DOCX (max 5MB)
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Uploaded file details */}
      {file && (
        <div className="mt-6">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Preview button */}
              <button
                onClick={handlePreview}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Preview file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              {/* Delete button */}
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Delete file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadResume;
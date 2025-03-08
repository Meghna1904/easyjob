import React, { useState } from 'react';
import { parseResume } from '../utils/resumeParser';
import { ResumeViewer } from './ResumeViewer';
import { ResumeScore } from './ResumeScore';
import { Upload, FileUp, Eye, EyeOff } from 'lucide-react';
import { FiCheck } from "react-icons/fi";
import { FiX } from "react-icons/fi";
const UploadResume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await parseResume(file);
      setResumeData(data);
      setResumeText(data.parsedText);
    } catch (err) {
      setError('Error processing the resume. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Updated scoring sections based on backend data
  const scoreSections = ['Education', 'Experience', 'Skills', 'Certifications'];
  const calculateScore = () => {
    let score = 0;
    scoreSections.forEach(section => {
      if (resumeData && resumeData[section.toLowerCase()] && resumeData[section.toLowerCase()].length > 0) {
        score += 25; // 25 points per section
      }
    });
    return Math.min(score, 100); // Cap at 100
  };

  const currentScore = resumeData ? calculateScore() : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">
            Smart Resume Analyzer
          </h1>
          <p className="text-gray-600">Upload your resume and get instant insights</p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out
            ${dragActive ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}
            ${!file ? 'hover:border-gray-400 hover:bg-gray-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <FileUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">
              {file ? file.name : 'Drag and drop your resume here'}
            </p>
            <p className="text-sm text-gray-500">
              {!file && 'or click to browse (PDF or DOCX)'}
            </p>
          </div>
        </div>

        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-6 w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Upload className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Processing...
              </span>
            ) : 'Analyze Resume'}
          </button>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {resumeData && (
          <div className="mt-12 space-y-8 animate-fade-in">
            <div className="bg-white/50 backdrop-blur-lg rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{resumeData.name}</p> {/* Placeholder; update if backend provides name */}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{resumeData.emails[0]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{resumeData.phone_numbers[0]}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-lg rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Skills Analysis</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Resume Score</p>
                  <p className="text-lg font-semibold">{currentScore}/100</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${currentScore}%` }}></div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Suggestions to improve your resume:</p>
                  <ul className="space-y-2">
                    {scoreSections.map(section => (
                      <li key={section} className={`flex items-center ${resumeData[section.toLowerCase()] && resumeData[section.toLowerCase()].length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {resumeData[section.toLowerCase()] && resumeData[section.toLowerCase()].length > 0 ? 
                          <FiCheck className="w-4 h-4 mr-2" /> : <FiX className="w-4 h-4 mr-2" />}
                        {section} {resumeData[section.toLowerCase()] && resumeData[section.toLowerCase()].length > 0 ? 'included' : 'missing'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-lg rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Course Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">The Complete Web Developer Course</h3>
                  <p className="text-gray-600">Master web development with this comprehensive course.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">React - The Complete Guide</h3>
                  <p className="text-gray-600">Learn React from scratch and build real-world applications.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">Node.js Developer Course</h3>
                  <p className="text-gray-600">Become a Node.js expert and build scalable backend systems.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">JavaScript: Understanding the Weird Parts</h3>
                  <p className="text-gray-600">Deep dive into JavaScript and understand its core concepts.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Resume Preview</h2>
              <button
                onClick={() => setShowPdfPreview(!showPdfPreview)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                {showPdfPreview ? (
                  <>
                    <EyeOff className="w-5 h-5 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Show Preview
                  </>
                )}
              </button>
            </div>

            {showPdfPreview && file && <ResumeViewer file={file} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;
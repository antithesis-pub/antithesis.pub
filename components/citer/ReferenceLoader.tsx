'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { parseBibTeX } from '@/utils/bibtex-parser';
import { parseCSLJSON } from '@/utils/csl-json-parser';
import type { CitationData } from '@/components/CitationManager';

interface ReferenceLoaderProps {
  onLoad: (citations: CitationData[]) => void;
  className?: string;
}

type FileFormat = 'bibtex' | 'csl-json' | 'json';

export default function ReferenceLoader({ onLoad, className = '' }: ReferenceLoaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<FileFormat>('bibtex');
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccessMessage('');

    try {
      const text = await file.text();
      const citations = parseText(text, format);
      
      if (citations.length === 0) {
        setError('No valid citations found in the file');
        return;
      }

      onLoad(citations);
      setSuccessMessage(`Successfully loaded ${citations.length} citation${citations.length > 1 ? 's' : ''}`);
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setError(`Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTextSubmit = () => {
    setError('');
    setSuccessMessage('');

    if (!textInput.trim()) {
      setError('Please enter some text');
      return;
    }

    try {
      const citations = parseText(textInput, format);
      
      if (citations.length === 0) {
        setError('No valid citations found');
        return;
      }

      onLoad(citations);
      setSuccessMessage(`Successfully loaded ${citations.length} citation${citations.length > 1 ? 's' : ''}`);
      setTextInput('');
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setError(`Error parsing text: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const parseText = (text: string, fileFormat: FileFormat): CitationData[] => {
    switch (fileFormat) {
      case 'bibtex':
        return parseBibTeX(text);
      case 'csl-json':
        return parseCSLJSON(text);
      case 'json':
        // Simple JSON format matching CitationData structure
        try {
          const data = JSON.parse(text);
          return Array.isArray(data) ? data : [data];
        } catch {
          throw new Error('Invalid JSON format');
        }
      default:
        throw new Error('Unsupported format');
    }
  };

  const getFileExtension = (): string => {
    switch (format) {
      case 'bibtex': return '.bib';
      case 'csl-json': return '.json';
      case 'json': return '.json';
      default: return '';
    }
  };

  const getPlaceholderText = (): string => {
    switch (format) {
      case 'bibtex':
        return `@article{smith2025,
  author = {Smith, John and Doe, Jane},
  year = {2025},
  title = {Example Article},
  journal = {Journal Name},
  volume = {42},
  pages = {1-20}
}`;
      case 'csl-json':
        return `[
  {
    "id": "smith2025",
    "type": "article-journal",
    "author": [
      {"family": "Smith", "given": "John"}
    ],
    "issued": {"date-parts": [[2025]]},
    "title": "Example Article",
    "container-title": "Journal Name"
  }
]`;
      case 'json':
        return `[
  {
    "id": "smith2025",
    "authors": ["Smith, J."],
    "year": 2025,
    "title": "Example Article",
    "publication": "Journal Name"
  }
]`;
      default:
        return '';
    }
  };

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        Load References
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Load References</h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Format selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as FileFormat)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="bibtex">BibTeX (.bib)</option>
                  <option value="csl-json">CSL-JSON</option>
                  <option value="json">Simple JSON</option>
                </select>
              </div>

              {/* File upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getFileExtension()}
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="text-center text-gray-500 mb-4">or</div>

              {/* Text input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Text
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={getPlaceholderText()}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm resize-vertical"
                />
              </div>

              {/* Error/Success messages */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                  {successMessage}
                </div>
              )}

              {/* Submit button */}
              <div className="flex gap-3">
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim()}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition ${
                    textInput.trim()
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Load from Text
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>

              {/* Format help */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Supported Formats:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>BibTeX:</strong> Export from Zotero, Mendeley, EndNote, or Google Scholar</li>
                  <li><strong>CSL-JSON:</strong> Citation Style Language JSON format</li>
                  <li><strong>Simple JSON:</strong> Direct CitationData format</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

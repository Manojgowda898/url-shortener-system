// ============================================
// FILE: src/components/URLInput.jsx
// ============================================

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export const URLInput = ({ onSubmit, error, onErrorClear }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiryDays, setExpiryDays] = useState('');

  const handleSubmit = () => {
    const result = onSubmit(longUrl, customCode, expiryDays);
    if (result) {
      setLongUrl('');
      setCustomCode('');
      setExpiryDays('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="space-y-4">
        <input
          type="url"
          value={longUrl}
          onChange={(e) => {
            setLongUrl(e.target.value);
            onErrorClear();
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter long URL (e.g., https://example.com/very/long/path)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Custom code (optional)"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            value={expiryDays}
            onChange={(e) => setExpiryDays(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Expires in (days)"
            min="1"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Shorten URL
          </button>
        </div>
      </div>
    </div>
  );
};
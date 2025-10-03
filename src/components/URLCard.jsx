// ============================================
// FILE: src/components/URLCard.jsx
// ============================================

import React, { useState } from 'react';
import { Copy, Check, LineChart, Trash2 } from 'lucide-react';
import { isExpired } from '../utils/urlUtils';

export const URLCard = ({ url, onDelete, onClick }) => {
  const [copiedId, setCopiedId] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const expired = isExpired(url);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(url.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${expired ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-gray-500">Original URL</p>
            {expired && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Expired</span>
            )}
            {url.expiresAt && !expired && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                Expires: {new Date(url.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-gray-700 truncate mb-4">{url.long}</p>
          
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onClick(url.code)}
              disabled={expired}
              className="text-indigo-600 font-mono text-lg hover:text-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {url.short}
            </button>
            <button
              onClick={() => copyToClipboard(url.short)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Copy to clipboard"
            >
              {copiedId === url.id ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="View Analytics"
            >
              <LineChart className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => onDelete(url.code)}
              className="p-2 hover:bg-red-100 rounded transition-colors"
              title="Delete URL"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>

          {/* Analytics Display */}
          {showAnalytics && url.clickHistory.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Recent Clicks</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {url.clickHistory.slice(-10).reverse().map((click, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{new Date(click.timestamp).toLocaleString()}</span>
                    <span className="text-gray-500">{click.location}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="text-right">
          <p className="text-3xl font-bold text-indigo-600">{url.clicks}</p>
          <p className="text-sm text-gray-500">clicks</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
        <span>Hash: {url.code}</span>
        <span>Created: {new Date(url.created).toLocaleString()}</span>
      </div>
    </div>
  );
};
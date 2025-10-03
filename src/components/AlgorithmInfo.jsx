// ============================================
// FILE: src/components/AlgorithmInfo.jsx
// ============================================

import React from 'react';

export const AlgorithmInfo = () => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Advanced Features & Data Structures
      </h2>
      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <strong className="text-gray-800">HashMap:</strong> O(1) lookup by short code for instant URL retrieval
        </div>
        <div>
          <strong className="text-gray-800">LRU Cache:</strong> Caches 10 most recently accessed URLs for performance
        </div>
        <div>
          <strong className="text-gray-800">Trie:</strong> Prefix-based search for fast URL filtering
        </div>
        <div>
          <strong className="text-gray-800">Hashing:</strong> Polynomial rolling hash with collision detection
        </div>
        <div>
          <strong className="text-gray-800">Base62 Encoding:</strong> Compact alphanumeric short codes
        </div>
        <div>
          <strong className="text-gray-800">TTL Management:</strong> Automatic cleanup of expired URLs
        </div>
        <div>
          <strong className="text-gray-800">Analytics:</strong> Real-time click tracking with timestamps
        </div>
        <div>
          <strong className="text-gray-800">QR Generation:</strong> Instant QR codes for mobile access
        </div>
      </div>
    </div>
  );
};
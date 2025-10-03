// ============================================
// FILE: src/components/SearchBar.jsx
// ============================================

import React from 'react';
import { Search, Download } from 'lucide-react';

export const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  filterBy, 
  onFilterChange, 
  onExport 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by URL or code (Trie-based search)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <select
          value={filterBy}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All URLs</option>
          <option value="popular">Most Popular</option>
          <option value="recent">Most Recent</option>
          <option value="expiring">With Expiry</option>
          <option value="expired">Expired</option>
        </select>

        <button
          onClick={onExport}
          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>
    </div>
  );
};
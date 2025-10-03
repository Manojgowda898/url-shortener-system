// ============================================
// FILE: src/App.jsx (Main Component)
// ============================================

import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Link2, Hash, TrendingUp, Clock } from 'lucide-react';
import { useURLShortener } from './hooks/useURLShortener';
import { StatsCard } from './components/StatsCard';
import { URLInput } from './components/URLInput';
import { SearchBar } from './components/SearchBar';
import { URLCard } from './components/URLCard';
import { EmptyState } from './components/EmptyState';
import { AlgorithmInfo } from './components/AlgorithmInfo';
import { Redirect } from './components/Redirect';
import { exportToCSV } from './utils/exportUtils';
import { isExpired } from './utils/urlUtils';

function URLShortenerApp() {
  const {
    urls,
    stats,
    error,
    setError,
    createShortUrl,
    handleUrlClick,
    deleteUrl,
    searchUrls
  } = useURLShortener();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Filter and sort URLs
  const filteredUrls = useMemo(() => {
    let results = searchQuery ? searchUrls(searchQuery) : urls;

    switch (filterBy) {
      case 'popular':
        results = [...results].sort((a, b) => b.clicks - a.clicks);
        break;
      case 'recent':
        results = [...results].sort((a, b) => new Date(b.created) - new Date(a.created));
        break;
      case 'expiring':
        results = results.filter(u => u.expiresAt);
        break;
      case 'expired':
        results = results.filter(u => isExpired(u));
        break;
      default:
        break;
    }

    return results;
  }, [urls, searchQuery, filterBy, searchUrls]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link2 className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Pro URL Shortener</h1>
          </div>
          <p className="text-gray-600">Advanced system with LRU Cache, Trie Search, HashMap & Analytics</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatsCard icon={Hash} value={stats.total} label="Total URLs" color="blue" />
          <StatsCard icon={TrendingUp} value={stats.clicks} label="Total Clicks" color="green" />
          <StatsCard icon={Clock} value={stats.active} label="Active Links" color="purple" />
        </div>

        {/* Input Section */}
        <URLInput 
          onSubmit={createShortUrl} 
          error={error} 
          onErrorClear={() => setError('')}
        />

        {/* Search and Filter */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          onExport={() => exportToCSV(urls)}
        />

        {/* URLs List */}
        <div className="space-y-4">
          {filteredUrls.map((url) => (
            <URLCard
              key={url.id}
              url={url}
              onDelete={deleteUrl}
              onClick={handleUrlClick}
            />
          ))}
        </div>

        {filteredUrls.length === 0 && <EmptyState searchQuery={searchQuery} />}

        {/* Algorithm Explanation */}
        <AlgorithmInfo />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/r/:code" element={<Redirect />} />
        <Route path="/" element={<URLShortenerApp />} />
      </Routes>
    </Router>
  );
}
// ============================================
// FILE: src/hooks/useURLShortener.js
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { LRUCache } from '../dataStructures/LRUCache';
import { Trie } from '../dataStructures/Trie';
import {
  isValidUrl,
  generateShortCode,
  isValidCustomCode,
  isExpired
} from '../utils/urlUtils';

// localStorage key
const STORAGE_KEY = 'shortenedUrls';

/**
 * Custom hook for URL shortener logic
 */
export const useURLShortener = () => {
  const [urls, setUrls] = useState([]);
  const [urlMap, setUrlMap] = useState(new Map());
  const [stats, setStats] = useState({ total: 0, clicks: 0, active: 0 });
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize data structures
  const [lruCache] = useState(() => new LRUCache(10));
  const [trie] = useState(() => new Trie());

  // Load URLs from localStorage on mount - ROBUST VERSION
  useEffect(() => {
    console.log('🔍 Loading data from localStorage...');
    
    const loadFromStorage = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        
        if (!storedData) {
          console.log('📭 No existing data in localStorage');
          setIsLoaded(true);
          return;
        }

        const parsedUrls = JSON.parse(storedData);
        
        // Validate the data structure
        if (!Array.isArray(parsedUrls)) {
          console.error('❌ Invalid data format in localStorage');
          localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
          setIsLoaded(true);
          return;
        }

        console.log('✅ Loaded', parsedUrls.length, 'URLs from localStorage');
        
        // Filter out any invalid URLs
        const validUrls = parsedUrls.filter(url => 
          url && 
          typeof url === 'object' &&
          url.id && 
          url.long && 
          url.short && 
          url.code
        );

        if (validUrls.length !== parsedUrls.length) {
          console.warn('⚠️ Filtered out', parsedUrls.length - validUrls.length, 'invalid URLs');
        }

        setUrls(validUrls);
        
        // Calculate stats
        const total = validUrls.length;
        const clicks = validUrls.reduce((sum, url) => sum + (url.clicks || 0), 0);
        const active = validUrls.filter(url => !isExpired(url)).length;
        
        setStats({ total, clicks, active });
        console.log('📊 Stats - Total:', total, 'Clicks:', clicks, 'Active:', active);
        
        // Rebuild urlMap and trie
        const newUrlMap = new Map();
        validUrls.forEach(url => {
          newUrlMap.set(url.code, url);
          indexUrlInTrie(url, trie);
        });
        setUrlMap(newUrlMap);
        
        setIsLoaded(true);
        console.log('🎯 Successfully initialized from localStorage');
        
      } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
        // Start fresh if data is corrupted
        localStorage.removeItem(STORAGE_KEY);
        setUrls([]);
        setStats({ total: 0, clicks: 0, active: 0 });
        setUrlMap(new Map());
        setIsLoaded(true);
      }
    };

    loadFromStorage();
  }, []);

  // Helper function to index URL in Trie for search
  const indexUrlInTrie = (url, trieInstance) => {
    if (!url || !url.long || !url.code) return;
    
    try {
      // Index words from long URL
      const wordsFromLongUrl = url.long.toLowerCase().split(/[^a-zA-Z0-9]/).filter(word => word.length > 2);
      wordsFromLongUrl.forEach(word => trieInstance.insert(word, url.id));
      
      // Index short code characters
      const codeChars = url.code.toLowerCase().split('');
      codeChars.forEach(char => trieInstance.insert(char, url.id));
      
      // Index full code
      trieInstance.insert(url.code.toLowerCase(), url.id);
      
      // Index domain and path parts
      const urlObj = new URL(url.long);
      const hostnameWords = urlObj.hostname.toLowerCase().split('.').filter(part => part.length > 2);
      hostnameWords.forEach(word => trieInstance.insert(word, url.id));
      
      const pathWords = urlObj.pathname.toLowerCase().split('/').filter(part => part.length > 2);
      pathWords.forEach(word => trieInstance.insert(word, url.id));
    } catch (e) {
      console.warn('⚠️ Could not index URL in Trie:', url.long);
    }
  };

  // Save URLs to localStorage whenever they change - ROBUST VERSION
  useEffect(() => {
    if (!isLoaded) {
      console.log('⏳ Skipping save - data not loaded yet');
      return;
    }

    console.log('💾 Saving', urls.length, 'URLs to localStorage...');
    
    try {
      // Create a clean copy without circular references
      const urlsToSave = urls.map(url => ({
        id: url.id,
        long: url.long,
        short: url.short,
        code: url.code,
        clicks: url.clicks || 0,
        clickHistory: url.clickHistory || [],
        created: url.created,
        expiresAt: url.expiresAt
      }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urlsToSave));
      console.log('✅ Successfully saved to localStorage');
      
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
      
      // Try to save with less data if storage is full
      try {
        const minimalUrls = urls.map(url => ({
          id: url.id,
          long: url.long,
          short: url.short,
          code: url.code,
          clicks: url.clicks || 0,
          created: url.created
        }));
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalUrls));
        console.log('✅ Saved minimal data to localStorage');
      } catch (secondError) {
        console.error('❌ Could not save even minimal data:', secondError);
      }
    }
  }, [urls, isLoaded]);

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        console.log('🔄 Storage changed in another tab, reloading...');
        try {
          const parsedUrls = JSON.parse(event.newValue);
          if (Array.isArray(parsedUrls)) {
            setUrls(parsedUrls);
            
            const total = parsedUrls.length;
            const clicks = parsedUrls.reduce((sum, url) => sum + (url.clicks || 0), 0);
            const active = parsedUrls.filter(url => !isExpired(url)).length;
            
            setStats({ total, clicks, active });
            
            const newUrlMap = new Map();
            parsedUrls.forEach(url => {
              newUrlMap.set(url.code, url);
            });
            setUrlMap(newUrlMap);
          }
        } catch (error) {
          console.error('❌ Error syncing from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Clean up expired URLs every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setUrls(prevUrls => {
        const active = prevUrls.filter(url => 
          !url.expiresAt || new Date(url.expiresAt) > now
        );
        if (active.length !== prevUrls.length) {
          setStats(prev => ({ ...prev, active: active.length }));
        }
        return active;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Create shortened URL
   */
  const createShortUrl = (longUrl, customCode = '', expiryDays = '') => {
    setError('');

    // Validation
    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return null;
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL with http:// or https://');
      return null;
    }

    let shortCode = customCode.trim();

    // Validate custom code
    if (shortCode) {
      if (!isValidCustomCode(shortCode)) {
        setError('Custom code must be 3-10 alphanumeric characters');
        return null;
      }
      if (urlMap.has(shortCode)) {
        setError('Custom code already taken');
        return null;
      }
    } else {
      // Check for existing URL
      const existing = Array.from(urlMap.values()).find(u => u.long === longUrl);
      if (existing) {
        setError('URL already shortened!');
        return null;
      }
      shortCode = generateShortCode(longUrl);
    }

    // Create URL object
    const now = new Date();
    const expiresAt = expiryDays 
      ? new Date(now.getTime() + parseInt(expiryDays) * 24 * 60 * 60 * 1000) 
      : null;

    const newUrl = {
      id: Date.now(),
      long: longUrl,
      short: `http://localhost:5173/#/r/${shortCode}`,
      code: shortCode,
      clicks: 0,
      clickHistory: [],
      created: now.toISOString(),
      expiresAt: expiresAt?.toISOString()
    };

    // Add to data structures
    urlMap.set(shortCode, newUrl);
    setUrlMap(new Map(urlMap));
    
    // Index the URL in Trie for search
    indexUrlInTrie(newUrl, trie);

    setUrls(prevUrls => [newUrl, ...prevUrls]);
    setStats(prev => ({ 
      ...prev, 
      total: prev.total + 1,
      active: prev.active + 1
    }));

    console.log('➕ Created new short URL:', newUrl.short);
    return newUrl;
  };

  /**
   * Handle URL click (redirect)
   */
  const handleUrlClick = (code) => {
    console.log('🖱️ URL clicked:', code);
    
    const url = urlMap.get(code);
    if (!url) {
      console.log('❌ URL not found in map');
      return;
    }

    if (isExpired(url)) {
      setError('This link has expired');
      return;
    }

    // Update LRU cache
    lruCache.put(code, url);

    // Record click
    const clickData = {
      timestamp: new Date().toISOString(),
      referrer: 'Direct',
      location: 'Bengaluru, IN'
    };

    const updatedUrl = {
      ...url,
      clicks: (url.clicks || 0) + 1,
      clickHistory: [...(url.clickHistory || []), clickData]
    };

    // Update all states
    urlMap.set(code, updatedUrl);
    setUrlMap(new Map(urlMap));
    
    setUrls(prevUrls => {
      const updatedUrls = prevUrls.map(u => u.id === url.id ? updatedUrl : u);
      return updatedUrls;
    });
    
    setStats(prev => {
      const newStats = { ...prev, clicks: prev.clicks + 1 };
      return newStats;
    });

    // Open URL
    window.open(url.long, '_blank');
  };

  /**
   * Delete URL
   */
  const deleteUrl = (code) => {
    console.log('🗑️ Deleting URL:', code);
    
    const url = urlMap.get(code);
    if (!url) return;

    urlMap.delete(code);
    setUrlMap(new Map(urlMap));
    
    setUrls(prevUrls => {
      const filtered = prevUrls.filter(u => u.code !== code);
      console.log('✅ Deleted URL, remaining:', filtered.length);
      return filtered;
    });
    
    setStats(prev => ({ 
      ...prev, 
      total: prev.total - 1,
      active: prev.active - 1
    }));
  };

  /**
   * Search URLs using hybrid approach (Trie + direct search)
   */
  const searchUrls = (query) => {
    if (!query.trim()) return urls;
    
    const searchTerm = query.toLowerCase().trim();
    console.log('🔍 Searching for:', searchTerm);
    
    // Method 1: Try Trie search first
    try {
      const matchingIds = trie.search(searchTerm);
      const trieResults = urls.filter(url => matchingIds.includes(url.id));
      
      if (trieResults.length > 0) {
        console.log('✅ Trie found', trieResults.length, 'results');
        return trieResults;
      }
    } catch (error) {
      console.log('⚠️ Trie search failed, using direct search');
    }
    
    // Method 2: Direct search fallback
    const directResults = urls.filter(url => 
      url.long.toLowerCase().includes(searchTerm) ||
      url.code.toLowerCase().includes(searchTerm) ||
      url.short.toLowerCase().includes(searchTerm)
    );
    
    console.log('✅ Direct search found', directResults.length, 'results');
    return directResults;
  };

  /**
   * Clear all data (for testing)
   */
  const clearAllData = () => {
    console.log('🧹 Clearing all data...');
    setUrls([]);
    setStats({ total: 0, clicks: 0, active: 0 });
    setUrlMap(new Map());
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    urls,
    stats,
    error,
    setError,
    createShortUrl,
    handleUrlClick,
    deleteUrl,
    searchUrls,
    clearAllData,
    lruCache,
    trie,
    isLoaded
  };
};
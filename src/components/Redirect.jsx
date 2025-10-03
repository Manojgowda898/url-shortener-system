// ============================================
// FILE: src/components/Redirect.jsx
// ============================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const Redirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const redirectToUrl = async () => {
      try {
        // Handle both /r/abc123 and /#/r/abc123 formats
        let actualCode = code;
        
        // If code is undefined, check the hash
        if (!actualCode && window.location.hash) {
          const hashMatch = window.location.hash.match(/\/r\/([a-zA-Z0-9]+)/);
          if (hashMatch) {
            actualCode = hashMatch[1];
          }
        }

        if (!actualCode) {
          setError('Invalid URL format');
          setLoading(false);
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Get URLs from localStorage
        const storedUrls = localStorage.getItem('shortenedUrls');
        const urls = storedUrls ? JSON.parse(storedUrls) : [];
        
        // Find the URL by code
        const urlData = urls.find(u => u.code === actualCode);
        
        if (urlData) {
          // RECORD THE CLICK (This is the key fix!)
          const updatedUrl = {
            ...urlData,
            clicks: urlData.clicks + 1,
            clickHistory: [
              ...urlData.clickHistory,
              {
                timestamp: new Date().toISOString(),
                referrer: document.referrer || 'Direct',
                location: 'Direct Visit'
              }
            ]
          };
          
          // Update storage with the new click count
          const updatedUrls = urls.map(u => u.code === actualCode ? updatedUrl : u);
          localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
          
          console.log('Redirect click recorded:', actualCode); // Debug log
          
          // Redirect to original URL
          window.location.href = urlData.long;
        } else {
          setError('URL not found');
          setLoading(false);
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        setError('Redirect failed');
        setLoading(false);
      }
    };

    redirectToUrl();
  }, [code, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your URL...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <p className="text-gray-600">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return null;
};
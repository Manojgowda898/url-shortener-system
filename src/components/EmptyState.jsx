// ============================================
// FILE: src/components/EmptyState.jsx
// ============================================

import React from 'react';
import { Link2 } from 'lucide-react';

export const EmptyState = ({ searchQuery }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-md">
      <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">
        {searchQuery 
          ? 'No URLs match your search' 
          : 'No URLs shortened yet. Enter a URL above to get started!'}
      </p>
    </div>
  );
};

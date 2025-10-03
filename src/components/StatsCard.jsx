// ============================================
// FILE: src/components/StatsCard.jsx
// ============================================

import React from 'react';

export const StatsCard = ({ icon: Icon, value, label, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3">
        <Icon className={`w-8 h-8 text-${color}-500`} />
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
};
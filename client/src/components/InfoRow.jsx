import React from 'react';

const InfoRow = ({ icon, label, value, truncate = false }) => (
  <div className="flex items-center space-x-3 group">
    <div className="text-gray-400 group-hover:text-blue-500 transition-colors">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-sm font-medium text-gray-700 ${truncate ? 'truncate' : ''}`}>{value}</p>
    </div>
  </div>
);

export default InfoRow;

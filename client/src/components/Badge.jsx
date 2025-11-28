import React from 'react';

const Badge = ({ text, color }) => {
  const colors = {
    red: "bg-red-50 text-red-700 border-red-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${colors[color] || colors.gray}`}>{text}</span>;
};
//op
export default Badge;

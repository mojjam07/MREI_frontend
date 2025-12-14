import React from 'react';


const StatCard = ({ icon, title, value, change, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-accent text-link',
    green: 'bg-accent text-success',
    purple: 'bg-accent text-link',
    orange: 'bg-accent text-warning'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text">{title}</p>
          <p className="text-2xl font-bold text-text">{value}</p>
          {change && (
            <p className="text-sm text-accent">{change}</p>
          )}
        </div>

        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {React.createElement(icon, { className: "w-6 h-6" })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

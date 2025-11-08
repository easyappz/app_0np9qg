import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color = '#3498db' }) => {
  return (
    <div className="stats-card" data-easytag="id1-react/src/components/admin/StatsCard.js">
      <div className="stats-card-content" data-easytag="id2-react/src/components/admin/StatsCard.js">
        <div className="stats-card-header" data-easytag="id3-react/src/components/admin/StatsCard.js">
          <h3 className="stats-card-title" data-easytag="id4-react/src/components/admin/StatsCard.js">
            {title}
          </h3>
          {icon && (
            <div 
              className="stats-card-icon" 
              style={{ color }}
              data-easytag="id5-react/src/components/admin/StatsCard.js"
            >
              {icon}
            </div>
          )}
        </div>
        <div 
          className="stats-card-value" 
          style={{ color }}
          data-easytag="id6-react/src/components/admin/StatsCard.js"
        >
          {value}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

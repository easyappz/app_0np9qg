import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './ActivityChart.css';

const ActivityChart = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}.${month}`;
  };

  const formattedData = data.map(item => ({
    ...item,
    dateFormatted: formatDate(item.date)
  }));

  return (
    <div className="activity-chart" data-easytag="id1-react/src/components/admin/ActivityChart.js">
      <h3 className="activity-chart-title" data-easytag="id2-react/src/components/admin/ActivityChart.js">
        Активность за последние 30 дней
      </h3>
      <div className="activity-chart-container" data-easytag="id3-react/src/components/admin/ActivityChart.js">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="dateFormatted" 
              stroke="#666"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#666"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
              formatter={(value) => [`${value} объявлений`, 'Создано']}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#3498db" 
              strokeWidth={2}
              dot={{ fill: '#3498db', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;

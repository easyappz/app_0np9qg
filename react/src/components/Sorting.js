import React from 'react';
import './Sorting.css';

const Sorting = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: '-created_at', label: 'По дате (новые первые)' },
    { value: 'price', label: 'По цене (возрастание)' },
    { value: '-price', label: 'По цене (убывание)' },
  ];

  return (
    <div className="sorting-container" data-easytag="id36-react/src/components/Sorting.js">
      <label htmlFor="sort-select" data-easytag="id37-react/src/components/Sorting.js">
        Сортировка:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
        data-easytag="id38-react/src/components/Sorting.js"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value} data-easytag="id39-react/src/components/Sorting.js">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Sorting;

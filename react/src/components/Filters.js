import React, { useState, useEffect } from 'react';
import { getCategories } from '../api/listingsService';
import './Filters.css';

const Filters = ({ filters, onFiltersChange, onReset }) => {
  const [categories, setCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    category: filters.category || '',
    min_price: filters.min_price || '',
    max_price: filters.max_price || '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setLocalFilters({
      search: filters.search || '',
      category: filters.category || '',
      min_price: filters.min_price || '',
      max_price: filters.max_price || '',
    });
  }, [filters]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      search: '',
      category: '',
      min_price: '',
      max_price: '',
    };
    setLocalFilters(emptyFilters);
    onReset();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="filters-container" data-easytag="id14-react/src/components/Filters.js">
      <div className="filters-header" onClick={toggleExpanded} data-easytag="id15-react/src/components/Filters.js">
        <h3 data-easytag="id16-react/src/components/Filters.js">Фильтры</h3>
        <button className="filters-toggle" data-easytag="id17-react/src/components/Filters.js">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <div className={`filters-content ${isExpanded ? 'expanded' : 'collapsed'}`} data-easytag="id18-react/src/components/Filters.js">
        <div className="filter-group" data-easytag="id19-react/src/components/Filters.js">
          <label htmlFor="search-input" data-easytag="id20-react/src/components/Filters.js">
            Поиск
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Поиск по названию и описанию..."
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            data-easytag="id21-react/src/components/Filters.js"
          />
        </div>

        <div className="filter-group" data-easytag="id22-react/src/components/Filters.js">
          <label htmlFor="category-select" data-easytag="id23-react/src/components/Filters.js">
            Категория
          </label>
          <select
            id="category-select"
            value={localFilters.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            data-easytag="id24-react/src/components/Filters.js"
          >
            <option value="" data-easytag="id25-react/src/components/Filters.js">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id} data-easytag="id26-react/src/components/Filters.js">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group" data-easytag="id27-react/src/components/Filters.js">
          <label data-easytag="id28-react/src/components/Filters.js">Цена</label>
          <div className="price-range" data-easytag="id29-react/src/components/Filters.js">
            <input
              type="number"
              placeholder="От"
              value={localFilters.min_price}
              onChange={(e) => handleInputChange('min_price', e.target.value)}
              min="0"
              data-easytag="id30-react/src/components/Filters.js"
            />
            <span className="price-separator" data-easytag="id31-react/src/components/Filters.js">—</span>
            <input
              type="number"
              placeholder="До"
              value={localFilters.max_price}
              onChange={(e) => handleInputChange('max_price', e.target.value)}
              min="0"
              data-easytag="id32-react/src/components/Filters.js"
            />
          </div>
        </div>

        <div className="filters-actions" data-easytag="id33-react/src/components/Filters.js">
          <button className="btn-apply" onClick={handleApply} data-easytag="id34-react/src/components/Filters.js">
            Применить
          </button>
          <button className="btn-reset" onClick={handleReset} data-easytag="id35-react/src/components/Filters.js">
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;

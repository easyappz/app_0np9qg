import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminListings, moderateListing } from '../../api/admin';
import ModerationListingRow from '../../components/admin/ModerationListingRow';
import './Moderation.css';

const Moderation = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'pending',
    search: '',
    ordering: '-created_at',
    page: 1
  });
  const [pagination, setPagination] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadListings();
  }, [filters]);

  const loadListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminListings(filters);
      setListings(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous
      });
    } catch (err) {
      console.error('Error loading listings:', err);
      setError('Ошибка загрузки объявлений');
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id, status) => {
    try {
      await moderateListing(id, status);
      showNotification(
        status === 'approved' ? 'Объявление одобрено' : 'Объявление отклонено',
        'success'
      );
      loadListings();
    } catch (err) {
      console.error('Moderation error:', err);
      showNotification('Ошибка при модерации объявления', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value, page: 1 });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleOrderingChange = (e) => {
    setFilters({ ...filters, ordering: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="moderation-page" data-easytag="id1-react/src/pages/admin/Moderation.js">
      <div className="moderation-header" data-easytag="id2-react/src/pages/admin/Moderation.js">
        <h1 data-easytag="id3-react/src/pages/admin/Moderation.js">Модерация объявлений</h1>
        <Link 
          to="/admin" 
          className="moderation-back-link"
          data-easytag="id4-react/src/pages/admin/Moderation.js"
        >
          ← Назад к панели
        </Link>
      </div>

      {notification && (
        <div 
          className={`notification notification-${notification.type}`}
          data-easytag="id5-react/src/pages/admin/Moderation.js"
        >
          {notification.message}
        </div>
      )}

      <div className="moderation-filters" data-easytag="id6-react/src/pages/admin/Moderation.js">
        <div className="filter-group" data-easytag="id7-react/src/pages/admin/Moderation.js">
          <label data-easytag="id8-react/src/pages/admin/Moderation.js">Статус:</label>
          <select 
            value={filters.status} 
            onChange={handleStatusChange}
            data-easytag="id9-react/src/pages/admin/Moderation.js"
          >
            <option value="">Все</option>
            <option value="pending">На модерации</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклоненные</option>
          </select>
        </div>

        <div className="filter-group" data-easytag="id10-react/src/pages/admin/Moderation.js">
          <label data-easytag="id11-react/src/pages/admin/Moderation.js">Поиск:</label>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Поиск по названию..."
            data-easytag="id12-react/src/pages/admin/Moderation.js"
          />
        </div>

        <div className="filter-group" data-easytag="id13-react/src/pages/admin/Moderation.js">
          <label data-easytag="id14-react/src/pages/admin/Moderation.js">Сортировка:</label>
          <select 
            value={filters.ordering} 
            onChange={handleOrderingChange}
            data-easytag="id15-react/src/pages/admin/Moderation.js"
          >
            <option value="-created_at">Сначала новые</option>
            <option value="created_at">Сначала старые</option>
            <option value="-updated_at">По дате обновления</option>
            <option value="status">По статусу</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="moderation-loading" data-easytag="id16-react/src/pages/admin/Moderation.js">
          Загрузка объявлений...
        </div>
      )}

      {error && (
        <div className="moderation-error" data-easytag="id17-react/src/pages/admin/Moderation.js">
          {error}
        </div>
      )}

      {!loading && !error && listings.length === 0 && (
        <div className="moderation-empty" data-easytag="id18-react/src/pages/admin/Moderation.js">
          Объявления не найдены
        </div>
      )}

      {!loading && !error && listings.length > 0 && (
        <>
          <div className="moderation-list" data-easytag="id19-react/src/pages/admin/Moderation.js">
            {listings.map(listing => (
              <ModerationListingRow
                key={listing.id}
                listing={listing}
                onModerate={handleModerate}
              />
            ))}
          </div>

          {pagination && pagination.count > 12 && (
            <div className="moderation-pagination" data-easytag="id20-react/src/pages/admin/Moderation.js">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={!pagination.previous}
                className="pagination-btn"
                data-easytag="id21-react/src/pages/admin/Moderation.js"
              >
                ← Предыдущая
              </button>
              <span className="pagination-info" data-easytag="id22-react/src/pages/admin/Moderation.js">
                Страница {filters.page}
              </span>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={!pagination.next}
                className="pagination-btn"
                data-easytag="id23-react/src/pages/admin/Moderation.js"
              >
                Следующая →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Moderation;

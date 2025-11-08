import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { deleteListing } from '../api/listings';
import { getMyListings } from '../api/listingsService';
import MyListingCard from '../components/MyListingCard';
import './MyListingsPage.css';

const MyListingsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyListings();
      setListings(data.results || []);
    } catch (error) {
      console.error('Failed to load my listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    if (activeTab !== 'all') {
      setSearchParams({ status: activeTab });
    } else {
      setSearchParams({});
    }
  }, [activeTab, setSearchParams]);

  const handleDelete = async (listingId) => {
    try {
      await deleteListing(listingId);
      await loadListings();
    } catch (error) {
      console.error('Failed to delete listing:', error);
      throw error;
    }
  };

  const getFilteredListings = () => {
    let filtered = listings;

    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(listing => listing.status === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return filtered;
  };

  const getStatusCounts = () => {
    return {
      all: listings.length,
      pending: listings.filter(l => l.status === 'pending').length,
      approved: listings.filter(l => l.status === 'approved').length,
      rejected: listings.filter(l => l.status === 'rejected').length,
    };
  };

  const handleCreateNew = () => {
    navigate('/create-listing');
  };

  const filteredListings = getFilteredListings();
  const statusCounts = getStatusCounts();

  const tabs = [
    { id: 'all', label: 'Все', count: statusCounts.all },
    { id: 'pending', label: 'На модерации', count: statusCounts.pending },
    { id: 'approved', label: 'Опубликованные', count: statusCounts.approved },
    { id: 'rejected', label: 'Отклоненные', count: statusCounts.rejected },
  ];

  return (
    <div className="my-listings-page" data-easytag="id1-react/src/pages/MyListingsPage.js">
      <div className="my-listings-header" data-easytag="id2-react/src/pages/MyListingsPage.js">
        <h1 data-easytag="id3-react/src/pages/MyListingsPage.js">Мои объявления</h1>
        <button className="create-listing-btn" onClick={handleCreateNew} data-easytag="id4-react/src/pages/MyListingsPage.js">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-easytag="id5-react/src/pages/MyListingsPage.js">
            <path d="M10 4v12m-6-6h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Создать объявление
        </button>
      </div>

      <div className="my-listings-tabs" data-easytag="id6-react/src/pages/MyListingsPage.js">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            data-easytag="id7-react/src/pages/MyListingsPage.js"
          >
            {tab.label}
            <span className="tab-count" data-easytag="id8-react/src/pages/MyListingsPage.js">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="my-listings-controls" data-easytag="id9-react/src/pages/MyListingsPage.js">
        <div className="search-box" data-easytag="id10-react/src/pages/MyListingsPage.js">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-easytag="id11-react/src/pages/MyListingsPage.js">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск в моих объявлениях..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-easytag="id12-react/src/pages/MyListingsPage.js"
          />
        </div>

        <div className="sort-box" data-easytag="id13-react/src/pages/MyListingsPage.js">
          <label data-easytag="id14-react/src/pages/MyListingsPage.js">Сортировка:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} data-easytag="id15-react/src/pages/MyListingsPage.js">
            <option value="date">По дате (новые первые)</option>
            <option value="price-asc">По цене (возрастание)</option>
            <option value="price-desc">По цене (убывание)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container" data-easytag="id16-react/src/pages/MyListingsPage.js">
          <div className="loading-grid" data-easytag="id17-react/src/pages/MyListingsPage.js">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="listing-skeleton" data-easytag="id18-react/src/pages/MyListingsPage.js">
                <div className="skeleton-image" data-easytag="id19-react/src/pages/MyListingsPage.js"></div>
                <div className="skeleton-content" data-easytag="id20-react/src/pages/MyListingsPage.js">
                  <div className="skeleton-title" data-easytag="id21-react/src/pages/MyListingsPage.js"></div>
                  <div className="skeleton-price" data-easytag="id22-react/src/pages/MyListingsPage.js"></div>
                  <div className="skeleton-meta" data-easytag="id23-react/src/pages/MyListingsPage.js"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="empty-state" data-easytag="id24-react/src/pages/MyListingsPage.js">
          <div className="empty-icon" data-easytag="id25-react/src/pages/MyListingsPage.js">📝</div>
          <h2 data-easytag="id26-react/src/pages/MyListingsPage.js">
            {activeTab === 'all' && listings.length === 0
              ? 'У вас пока нет объявлений'
              : `Нет объявлений в статусе "${tabs.find(t => t.id === activeTab)?.label}"`}
          </h2>
          <p data-easytag="id27-react/src/pages/MyListingsPage.js">
            {activeTab === 'all' && listings.length === 0
              ? 'Создайте первое объявление, чтобы начать продавать'
              : 'Попробуйте выбрать другой статус или изменить параметры поиска'}
          </p>
          {activeTab === 'all' && listings.length === 0 && (
            <button className="empty-create-btn" onClick={handleCreateNew} data-easytag="id28-react/src/pages/MyListingsPage.js">
              Создать объявление
            </button>
          )}
        </div>
      ) : (
        <div className="my-listings-grid" data-easytag="id29-react/src/pages/MyListingsPage.js">
          {filteredListings.map((listing) => (
            <MyListingCard key={listing.id} listing={listing} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;

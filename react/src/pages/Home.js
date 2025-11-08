import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getListings } from '../api/listingsService';
import ListingCard from '../components/ListingCard';
import Filters from '../components/Filters';
import Sorting from '../components/Sorting';
import Pagination from '../components/Pagination';
import './Home.css';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
  });
  const [sort, setSort] = useState(searchParams.get('ordering') || '-created_at');

  const updateURLParams = useCallback((newPage, newFilters, newSort) => {
    const params = {};

    if (newPage && newPage !== 1) {
      params.page = newPage;
    }

    if (newFilters.search) {
      params.search = newFilters.search;
    }

    if (newFilters.category) {
      params.category = newFilters.category;
    }

    if (newFilters.min_price) {
      params.min_price = newFilters.min_price;
    }

    if (newFilters.max_price) {
      params.max_price = newFilters.max_price;
    }

    if (newSort && newSort !== '-created_at') {
      params.ordering = newSort;
    }

    setSearchParams(params);
  }, [setSearchParams]);

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getListings(page, filters, sort);
      setListings(data.results || []);
      setTotalPages(Math.ceil(data.count / 12) || 1);
    } catch (error) {
      console.error('Failed to load listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters, sort]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    updateURLParams(page, filters, sort);
  }, [page, filters, sort, updateURLParams]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      search: '',
      category: '',
      min_price: '',
      max_price: '',
    };
    setFilters(emptyFilters);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page" data-easytag="id46-react/src/pages/Home.js">
      <div className="home-container" data-easytag="id47-react/src/pages/Home.js">
        <aside className="home-sidebar" data-easytag="id48-react/src/pages/Home.js">
          <Filters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </aside>

        <main className="home-main" data-easytag="id49-react/src/pages/Home.js">
          <div className="home-header" data-easytag="id50-react/src/pages/Home.js">
            <h1 data-easytag="id51-react/src/pages/Home.js">Все объявления</h1>
            <Sorting currentSort={sort} onSortChange={handleSortChange} />
          </div>

          {loading ? (
            <div className="loading-container" data-easytag="id52-react/src/pages/Home.js">
              <div className="loading-grid" data-easytag="id53-react/src/pages/Home.js">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="listing-skeleton" data-easytag="id54-react/src/pages/Home.js">
                    <div className="skeleton-image" data-easytag="id55-react/src/pages/Home.js"></div>
                    <div className="skeleton-content" data-easytag="id56-react/src/pages/Home.js">
                      <div className="skeleton-title" data-easytag="id57-react/src/pages/Home.js"></div>
                      <div className="skeleton-price" data-easytag="id58-react/src/pages/Home.js"></div>
                      <div className="skeleton-meta" data-easytag="id59-react/src/pages/Home.js"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state" data-easytag="id60-react/src/pages/Home.js">
              <div className="empty-icon" data-easytag="id61-react/src/pages/Home.js">📭</div>
              <h2 data-easytag="id62-react/src/pages/Home.js">Объявлений не найдено</h2>
              <p data-easytag="id63-react/src/pages/Home.js">
                Попробуйте изменить параметры поиска или сбросить фильтры
              </p>
              <button
                className="empty-reset-btn"
                onClick={handleResetFilters}
                data-easytag="id64-react/src/pages/Home.js"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="listings-grid" data-easytag="id65-react/src/pages/Home.js">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;

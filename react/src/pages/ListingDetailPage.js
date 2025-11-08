import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListingById, deleteListing } from '../api/listings';
import { useAuth } from '../context/AuthContext';
import ImageSlider from '../components/ImageSlider';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import './ListingDetailPage.css';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching listing:', err);
        if (err.response?.status === 404) {
          setError('Объявление не найдено');
        } else {
          setError('Ошибка при загрузке объявления');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteListing(id);
      navigate('/my-listings', { replace: true });
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Ошибка при удалении объявления');
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusText = (status) => {
    const statuses = {
      pending: 'На модерации',
      approved: 'Опубликовано',
      rejected: 'Отклонено',
    };
    return statuses[status] || status;
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const isAuthor = user && listing && user.id === listing.author.id;

  if (loading) {
    return (
      <div data-easytag="id1-react/src/pages/ListingDetailPage.js" className="container">
        <div data-easytag="id2-react/src/pages/ListingDetailPage.js" className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-easytag="id3-react/src/pages/ListingDetailPage.js" className="container">
        <div data-easytag="id4-react/src/pages/ListingDetailPage.js" className="error-container">
          <h2 data-easytag="id5-react/src/pages/ListingDetailPage.js">{error}</h2>
          <Link data-easytag="id6-react/src/pages/ListingDetailPage.js" to="/" className="btn btn-primary">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <div data-easytag="id7-react/src/pages/ListingDetailPage.js" className="container listing-detail-container">
      {/* Breadcrumbs */}
      <nav data-easytag="id8-react/src/pages/ListingDetailPage.js" className="breadcrumbs">
        <Link data-easytag="id9-react/src/pages/ListingDetailPage.js" to="/">Главная</Link>
        <span data-easytag="id10-react/src/pages/ListingDetailPage.js"> / </span>
        <span data-easytag="id11-react/src/pages/ListingDetailPage.js">{listing.category.name}</span>
        <span data-easytag="id12-react/src/pages/ListingDetailPage.js"> / </span>
        <span data-easytag="id13-react/src/pages/ListingDetailPage.js" className="current">{listing.title}</span>
      </nav>

      {/* Back button */}
      <button
        data-easytag="id14-react/src/pages/ListingDetailPage.js"
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Назад
      </button>

      {/* Main content */}
      <div data-easytag="id15-react/src/pages/ListingDetailPage.js" className="listing-detail-content">
        {/* Left section: Image slider */}
        <div data-easytag="id16-react/src/pages/ListingDetailPage.js" className="listing-images-section">
          <ImageSlider images={listing.images} />
        </div>

        {/* Right section: Quick info */}
        <div data-easytag="id17-react/src/pages/ListingDetailPage.js" className="listing-info-section">
          <div data-easytag="id18-react/src/pages/ListingDetailPage.js" className="listing-header">
            <h1 data-easytag="id19-react/src/pages/ListingDetailPage.js" className="listing-title">
              {listing.title}
            </h1>
            {isAuthor && (
              <span data-easytag="id20-react/src/pages/ListingDetailPage.js" className={getStatusClass(listing.status)}>
                {getStatusText(listing.status)}
              </span>
            )}
          </div>

          <div data-easytag="id21-react/src/pages/ListingDetailPage.js" className="listing-price">
            {formatPrice(listing.price)} ₽
          </div>

          <div data-easytag="id22-react/src/pages/ListingDetailPage.js" className="listing-meta">
            <div data-easytag="id23-react/src/pages/ListingDetailPage.js" className="meta-item">
              <span data-easytag="id24-react/src/pages/ListingDetailPage.js" className="meta-label">Категория:</span>
              <span data-easytag="id25-react/src/pages/ListingDetailPage.js" className="meta-value category-badge">
                {listing.category.name}
              </span>
            </div>
            <div data-easytag="id26-react/src/pages/ListingDetailPage.js" className="meta-item">
              <span data-easytag="id27-react/src/pages/ListingDetailPage.js" className="meta-label">Опубликовано:</span>
              <span data-easytag="id28-react/src/pages/ListingDetailPage.js" className="meta-value">
                {formatDate(listing.created_at)}
              </span>
            </div>
            {listing.created_at !== listing.updated_at && (
              <div data-easytag="id29-react/src/pages/ListingDetailPage.js" className="meta-item">
                <span data-easytag="id30-react/src/pages/ListingDetailPage.js" className="meta-label">Обновлено:</span>
                <span data-easytag="id31-react/src/pages/ListingDetailPage.js" className="meta-value">
                  {formatDate(listing.updated_at)}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div data-easytag="id32-react/src/pages/ListingDetailPage.js" className="listing-actions">
            <button
              data-easytag="id33-react/src/pages/ListingDetailPage.js"
              className="btn btn-secondary"
              onClick={handleShare}
            >
              {copySuccess ? '✓ Скопировано!' : '🔗 Поделиться'}
            </button>
            {isAuthor && (
              <>
                <Link
                  data-easytag="id34-react/src/pages/ListingDetailPage.js"
                  to={`/edit-listing/${listing.id}`}
                  className="btn btn-primary"
                >
                  ✏️ Редактировать
                </Link>
                <button
                  data-easytag="id35-react/src/pages/ListingDetailPage.js"
                  className="btn btn-danger"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  🗑️ Удалить
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description section */}
      <div data-easytag="id36-react/src/pages/ListingDetailPage.js" className="listing-description-section">
        <h2 data-easytag="id37-react/src/pages/ListingDetailPage.js">Описание</h2>
        <p data-easytag="id38-react/src/pages/ListingDetailPage.js" className="listing-description">
          {listing.description}
        </p>
      </div>

      {/* Author contact section */}
      <div data-easytag="id39-react/src/pages/ListingDetailPage.js" className="author-contact-section">
        <h2 data-easytag="id40-react/src/pages/ListingDetailPage.js">Контакты продавца</h2>
        <div data-easytag="id41-react/src/pages/ListingDetailPage.js" className="author-card">
          <div data-easytag="id42-react/src/pages/ListingDetailPage.js" className="author-info">
            {listing.author.avatar_url ? (
              <img
                data-easytag="id43-react/src/pages/ListingDetailPage.js"
                src={listing.author.avatar_url}
                alt={listing.author.username}
                className="author-avatar"
              />
            ) : (
              <div data-easytag="id44-react/src/pages/ListingDetailPage.js" className="author-avatar-placeholder">
                {listing.author.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div data-easytag="id45-react/src/pages/ListingDetailPage.js" className="author-details">
              <h3 data-easytag="id46-react/src/pages/ListingDetailPage.js" className="author-name">
                {listing.author.first_name && listing.author.last_name
                  ? `${listing.author.first_name} ${listing.author.last_name}`
                  : listing.author.username}
              </h3>
              <Link
                data-easytag="id47-react/src/pages/ListingDetailPage.js"
                to={`/users/${listing.author.id}`}
                className="author-link"
              >
                Посмотреть все объявления
              </Link>
            </div>
          </div>
          <div data-easytag="id48-react/src/pages/ListingDetailPage.js" className="contact-info">
            {listing.author_phone && (
              <div data-easytag="id49-react/src/pages/ListingDetailPage.js" className="contact-item">
                <span data-easytag="id50-react/src/pages/ListingDetailPage.js" className="contact-icon">📞</span>
                <a
                  data-easytag="id51-react/src/pages/ListingDetailPage.js"
                  href={`tel:${listing.author_phone}`}
                  className="contact-link"
                >
                  {listing.author_phone}
                </a>
              </div>
            )}
            {listing.author_email && (
              <div data-easytag="id52-react/src/pages/ListingDetailPage.js" className="contact-item">
                <span data-easytag="id53-react/src/pages/ListingDetailPage.js" className="contact-icon">✉️</span>
                <a
                  data-easytag="id54-react/src/pages/ListingDetailPage.js"
                  href={`mailto:${listing.author_email}`}
                  className="contact-link"
                >
                  {listing.author_email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ListingDetailPage;
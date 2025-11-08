import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyListingCard.css';

const MyListingCard = ({ listing, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: 'На модерации',
        className: 'status-pending',
        color: '#ff9800',
      },
      approved: {
        label: 'Опубликовано',
        className: 'status-approved',
        color: '#4caf50',
      },
      rejected: {
        label: 'Отклонено',
        className: 'status-rejected',
        color: '#f44336',
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit-listing/${listing.id}`);
  };

  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/listing/${listing.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(listing.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete listing:', error);
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  };

  const statusInfo = getStatusInfo(listing.status);

  return (
    <>
      <div className="my-listing-card" data-easytag="id1-react/src/components/MyListingCard.js">
        <div className="my-listing-card-image" data-easytag="id2-react/src/components/MyListingCard.js">
          {listing.first_image ? (
            <img src={listing.first_image} alt={listing.title} data-easytag="id3-react/src/components/MyListingCard.js" />
          ) : (
            <div className="my-listing-card-placeholder" data-easytag="id4-react/src/components/MyListingCard.js">
              <span data-easytag="id5-react/src/components/MyListingCard.js">Нет фото</span>
            </div>
          )}
          <div className={`my-listing-status-badge ${statusInfo.className}`} data-easytag="id6-react/src/components/MyListingCard.js">
            {statusInfo.label}
          </div>
        </div>

        <div className="my-listing-card-content" data-easytag="id7-react/src/components/MyListingCard.js">
          <h3 className="my-listing-card-title" data-easytag="id8-react/src/components/MyListingCard.js">
            {listing.title}
          </h3>
          <p className="my-listing-card-price" data-easytag="id9-react/src/components/MyListingCard.js">
            {formatPrice(listing.price)}
          </p>
          <div className="my-listing-card-meta" data-easytag="id10-react/src/components/MyListingCard.js">
            <span className="my-listing-card-category" data-easytag="id11-react/src/components/MyListingCard.js">
              {listing.category_name}
            </span>
          </div>
          <div className="my-listing-card-dates" data-easytag="id12-react/src/components/MyListingCard.js">
            <div className="my-listing-date" data-easytag="id13-react/src/components/MyListingCard.js">
              <span className="date-label" data-easytag="id14-react/src/components/MyListingCard.js">Создано:</span>
              <span className="date-value" data-easytag="id15-react/src/components/MyListingCard.js">{formatDate(listing.created_at)}</span>
            </div>
            <div className="my-listing-date" data-easytag="id16-react/src/components/MyListingCard.js">
              <span className="date-label" data-easytag="id17-react/src/components/MyListingCard.js">Обновлено:</span>
              <span className="date-value" data-easytag="id18-react/src/components/MyListingCard.js">{formatDate(listing.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="my-listing-card-actions" data-easytag="id19-react/src/components/MyListingCard.js">
          <button
            className="action-btn view-btn"
            onClick={handleView}
            title="Просмотр"
            data-easytag="id20-react/src/components/MyListingCard.js"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-easytag="id21-react/src/components/MyListingCard.js">
              <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="currentColor"/>
            </svg>
            <span data-easytag="id22-react/src/components/MyListingCard.js">Просмотр</span>
          </button>
          <button
            className="action-btn edit-btn"
            onClick={handleEdit}
            title="Редактировать"
            data-easytag="id23-react/src/components/MyListingCard.js"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-easytag="id24-react/src/components/MyListingCard.js">
              <path d="M2.5 14.375v3.125h3.125l9.217-9.217-3.125-3.125L2.5 14.375zm14.758-8.508a.83.83 0 000-1.175l-1.95-1.95a.83.83 0 00-1.175 0l-1.525 1.525 3.125 3.125 1.525-1.525z" fill="currentColor"/>
            </svg>
            <span data-easytag="id25-react/src/components/MyListingCard.js">Редактировать</span>
          </button>
          <button
            className="action-btn delete-btn"
            onClick={handleDeleteClick}
            title="Удалить"
            data-easytag="id26-react/src/components/MyListingCard.js"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-easytag="id27-react/src/components/MyListingCard.js">
              <path d="M5 15.833c0 .917.75 1.667 1.667 1.667h6.666c.917 0 1.667-.75 1.667-1.667v-10H5v10zm10.833-12.5h-2.916L12.083 2.5H7.917l-.834.833H4.167V5h11.666V3.333z" fill="currentColor"/>
            </svg>
            <span data-easytag="id28-react/src/components/MyListingCard.js">Удалить</span>
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={handleDeleteCancel} data-easytag="id29-react/src/components/MyListingCard.js">
          <div className="delete-modal" onClick={(e) => e.stopPropagation()} data-easytag="id30-react/src/components/MyListingCard.js">
            <h3 data-easytag="id31-react/src/components/MyListingCard.js">Удалить объявление?</h3>
            <p data-easytag="id32-react/src/components/MyListingCard.js">
              Вы уверены, что хотите удалить объявление «{listing.title}»? Это действие нельзя отменить.
            </p>
            <div className="delete-modal-actions" data-easytag="id33-react/src/components/MyListingCard.js">
              <button
                className="cancel-btn"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                data-easytag="id34-react/src/components/MyListingCard.js"
              >
                Отмена
              </button>
              <button
                className="confirm-delete-btn"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                data-easytag="id35-react/src/components/MyListingCard.js"
              >
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyListingCard;

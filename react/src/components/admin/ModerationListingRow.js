import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModerationListingRow.css';

const ModerationListingRow = ({ listing, onModerate }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setShowConfirm('approve');
  };

  const handleReject = async () => {
    setShowConfirm('reject');
  };

  const confirmAction = async () => {
    if (!showConfirm) return;

    setIsLoading(true);
    try {
      const status = showConfirm === 'approve' ? 'approved' : 'rejected';
      await onModerate(listing.id, status);
      setShowConfirm(null);
    } catch (error) {
      console.error('Moderation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAction = () => {
    setShowConfirm(null);
  };

  const handleView = () => {
    navigate(`/listing/${listing.id}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'На модерации', class: 'status-pending' },
      approved: { text: 'Одобрено', class: 'status-approved' },
      rejected: { text: 'Отклонено', class: 'status-rejected' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="moderation-row" data-easytag="id1-react/src/components/admin/ModerationListingRow.js">
      <div className="moderation-row-content" data-easytag="id2-react/src/components/admin/ModerationListingRow.js">
        <div className="moderation-row-info" data-easytag="id3-react/src/components/admin/ModerationListingRow.js">
          <h4 className="moderation-row-title" data-easytag="id4-react/src/components/admin/ModerationListingRow.js">
            {listing.title}
          </h4>
          <div className="moderation-row-meta" data-easytag="id5-react/src/components/admin/ModerationListingRow.js">
            <span data-easytag="id6-react/src/components/admin/ModerationListingRow.js">
              <strong>Автор:</strong> {listing.author_username}
            </span>
            <span data-easytag="id7-react/src/components/admin/ModerationListingRow.js">
              <strong>Категория:</strong> {listing.category_name}
            </span>
            <span data-easytag="id8-react/src/components/admin/ModerationListingRow.js">
              <strong>Цена:</strong> {formatPrice(listing.price)}
            </span>
            <span data-easytag="id9-react/src/components/admin/ModerationListingRow.js">
              <strong>Дата:</strong> {formatDate(listing.created_at)}
            </span>
          </div>
          <div className="moderation-row-status" data-easytag="id10-react/src/components/admin/ModerationListingRow.js">
            {getStatusBadge(listing.status)}
          </div>
        </div>

        {!showConfirm && (
          <div className="moderation-row-actions" data-easytag="id11-react/src/components/admin/ModerationListingRow.js">
            <button
              onClick={handleView}
              className="moderation-btn moderation-btn-view"
              data-easytag="id12-react/src/components/admin/ModerationListingRow.js"
            >
              Просмотр
            </button>
            {listing.status === 'pending' && (
              <>
                <button
                  onClick={handleApprove}
                  className="moderation-btn moderation-btn-approve"
                  data-easytag="id13-react/src/components/admin/ModerationListingRow.js"
                >
                  Одобрить
                </button>
                <button
                  onClick={handleReject}
                  className="moderation-btn moderation-btn-reject"
                  data-easytag="id14-react/src/components/admin/ModerationListingRow.js"
                >
                  Отклонить
                </button>
              </>
            )}
          </div>
        )}

        {showConfirm && (
          <div className="moderation-row-confirm" data-easytag="id15-react/src/components/admin/ModerationListingRow.js">
            <p data-easytag="id16-react/src/components/admin/ModerationListingRow.js">
              {showConfirm === 'approve'
                ? 'Вы уверены, что хотите одобрить это объявление?'
                : 'Вы уверены, что хотите отклонить это объявление?'}
            </p>
            <div className="moderation-confirm-actions" data-easytag="id17-react/src/components/admin/ModerationListingRow.js">
              <button
                onClick={confirmAction}
                className={`moderation-btn ${
                  showConfirm === 'approve' ? 'moderation-btn-approve' : 'moderation-btn-reject'
                }`}
                disabled={isLoading}
                data-easytag="id18-react/src/components/admin/ModerationListingRow.js"
              >
                {isLoading ? 'Обработка...' : 'Подтвердить'}
              </button>
              <button
                onClick={cancelAction}
                className="moderation-btn moderation-btn-cancel"
                disabled={isLoading}
                data-easytag="id19-react/src/components/admin/ModerationListingRow.js"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationListingRow;

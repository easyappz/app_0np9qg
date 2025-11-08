import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ListingCard.css';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'только что';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${getPluralForm(diffInMinutes, 'минуту', 'минуты', 'минут')} назад`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${getPluralForm(diffInHours, 'час', 'часа', 'часов')} назад`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${getPluralForm(diffInDays, 'день', 'дня', 'дней')} назад`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${getPluralForm(diffInMonths, 'месяц', 'месяца', 'месяцев')} назад`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${getPluralForm(diffInYears, 'год', 'года', 'лет')} назад`;
  };

  const getPluralForm = (number, one, two, five) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }
    n %= 10;
    if (n === 1) {
      return one;
    }
    if (n >= 2 && n <= 4) {
      return two;
    }
    return five;
  };

  const truncateTitle = (title, maxLength = 60) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div className="listing-card" onClick={handleClick} data-easytag="id1-react/src/components/ListingCard.js">
      <div className="listing-card-image" data-easytag="id2-react/src/components/ListingCard.js">
        {listing.first_image ? (
          <img src={listing.first_image} alt={listing.title} data-easytag="id3-react/src/components/ListingCard.js" />
        ) : (
          <div className="listing-card-placeholder" data-easytag="id4-react/src/components/ListingCard.js">
            <span data-easytag="id5-react/src/components/ListingCard.js">Нет фото</span>
          </div>
        )}
      </div>
      <div className="listing-card-content" data-easytag="id6-react/src/components/ListingCard.js">
        <h3 className="listing-card-title" data-easytag="id7-react/src/components/ListingCard.js">
          {truncateTitle(listing.title)}
        </h3>
        <p className="listing-card-price" data-easytag="id8-react/src/components/ListingCard.js">
          {formatPrice(listing.price)}
        </p>
        <div className="listing-card-meta" data-easytag="id9-react/src/components/ListingCard.js">
          <span className="listing-card-category" data-easytag="id10-react/src/components/ListingCard.js">
            {listing.category_name}
          </span>
          <span className="listing-card-divider" data-easytag="id11-react/src/components/ListingCard.js">•</span>
          <span className="listing-card-date" data-easytag="id12-react/src/components/ListingCard.js">
            {formatRelativeTime(listing.created_at)}
          </span>
        </div>
        <p className="listing-card-author" data-easytag="id13-react/src/components/ListingCard.js">
          {listing.author_name}
        </p>
      </div>
    </div>
  );
};

export default ListingCard;

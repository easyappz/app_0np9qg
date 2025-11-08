import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div data-easytag="id1-react/src/pages/NotFoundPage.js" className="container" style={{
      textAlign: 'center',
      padding: '4rem 1rem'
    }}>
      <h1 data-easytag="id2-react/src/pages/NotFoundPage.js" style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <p data-easytag="id3-react/src/pages/NotFoundPage.js" style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Страница не найдена
      </p>
      <Link data-easytag="id4-react/src/pages/NotFoundPage.js" to="/" style={{
        display: 'inline-block',
        padding: '0.75rem 1.5rem',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--text-white)',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        fontWeight: '500'
      }}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFoundPage;
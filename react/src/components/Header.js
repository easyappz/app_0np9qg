import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { isAuthenticated, user, isModerator, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header data-easytag="id1-react/src/components/Header.js" className="header">
      <div data-easytag="id2-react/src/components/Header.js" className="header-container container">
        <Link data-easytag="id3-react/src/components/Header.js" to="/" className="header-logo">
          Доска объявлений
        </Link>

        <nav data-easytag="id4-react/src/components/Header.js" className="header-nav">
          <Link data-easytag="id5-react/src/components/Header.js" to="/" className="header-nav-link">
            Главная
          </Link>

          {isAuthenticated ? (
            <>
              <Link data-easytag="id6-react/src/components/Header.js" to="/create-listing" className="header-nav-link header-nav-link-primary">
                Создать объявление
              </Link>

              <div data-easytag="id7-react/src/components/Header.js" className="header-user-menu">
                <button data-easytag="id8-react/src/components/Header.js" className="header-user-button" onClick={toggleMenu}>
                  {user?.avatar ? (
                    <img data-easytag="id9-react/src/components/Header.js" src={user.avatar} alt={user.name} className="header-user-avatar" />
                  ) : (
                    <div data-easytag="id10-react/src/components/Header.js" className="header-user-avatar-placeholder">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span data-easytag="id11-react/src/components/Header.js" className="header-user-name">
                    {user?.name || 'Пользователь'}
                  </span>
                </button>

                {menuOpen && (
                  <div data-easytag="id12-react/src/components/Header.js" className="header-dropdown">
                    <Link data-easytag="id13-react/src/components/Header.js" to="/profile" className="header-dropdown-item" onClick={() => setMenuOpen(false)}>
                      Профиль
                    </Link>
                    <Link data-easytag="id14-react/src/components/Header.js" to="/my-listings" className="header-dropdown-item" onClick={() => setMenuOpen(false)}>
                      Мои объявления
                    </Link>
                    {isModerator && (
                      <>
                        <div data-easytag="id15-react/src/components/Header.js" className="header-dropdown-divider"></div>
                        <Link data-easytag="id16-react/src/components/Header.js" to="/admin" className="header-dropdown-item" onClick={() => setMenuOpen(false)}>
                          Админ-панель
                        </Link>
                        <Link data-easytag="id17-react/src/components/Header.js" to="/admin/moderation" className="header-dropdown-item" onClick={() => setMenuOpen(false)}>
                          Модерация
                        </Link>
                      </>
                    )}
                    <div data-easytag="id18-react/src/components/Header.js" className="header-dropdown-divider"></div>
                    <button data-easytag="id19-react/src/components/Header.js" className="header-dropdown-item header-dropdown-logout" onClick={handleLogout}>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link data-easytag="id20-react/src/components/Header.js" to="/login" className="header-nav-link">
                Войти
              </Link>
              <Link data-easytag="id21-react/src/components/Header.js" to="/register" className="header-nav-link header-nav-link-primary">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
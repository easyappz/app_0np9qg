import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);

  const isModerator = user?.is_staff || user?.is_moderator;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header
      data-easytag="id1-react/src/components/Header.js"
      className={`header ${isScrolled ? 'header-scrolled' : ''}`}
    >
      <div data-easytag="id2-react/src/components/Header.js" className="header-container">
        {/* Logo */}
        <Link
          data-easytag="id3-react/src/components/Header.js"
          to="/"
          className="header-logo"
          onClick={closeMenus}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="6" fill="#2563eb" />
            <path
              d="M8 12h16M8 16h16M8 20h10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>Доска объявлений</span>
        </Link>

        {/* Desktop Navigation */}
        <nav data-easytag="id4-react/src/components/Header.js" className="header-nav">
          <Link
            data-easytag="id5-react/src/components/Header.js"
            to="/"
            className="header-nav-link"
          >
            Главная
          </Link>
          {isAuthenticated && (
            <>
              <Link
                data-easytag="id6-react/src/components/Header.js"
                to="/my-listings"
                className="header-nav-link"
              >
                Мои объявления
              </Link>
              <Link
                data-easytag="id7-react/src/components/Header.js"
                to="/create-listing"
                className="header-nav-link header-nav-link-primary"
              >
                Создать объявление
              </Link>
            </>
          )}
          {isModerator && (
            <Link
              data-easytag="id8-react/src/components/Header.js"
              to="/admin"
              className="header-nav-link"
            >
              Админ-панель
            </Link>
          )}
        </nav>

        {/* User Menu / Auth Buttons */}
        <div data-easytag="id9-react/src/components/Header.js" className="header-right">
          {isAuthenticated ? (
            <div
              data-easytag="id10-react/src/components/Header.js"
              className="header-user-menu"
              ref={userMenuRef}
            >
              <button
                data-easytag="id11-react/src/components/Header.js"
                className="header-user-button"
                onClick={toggleUserMenu}
                aria-label="Меню пользователя"
              >
                {user?.avatar ? (
                  <img
                    data-easytag="id12-react/src/components/Header.js"
                    src={user.avatar}
                    alt={user.first_name || user.username}
                    className="header-user-avatar"
                  />
                ) : (
                  <div
                    data-easytag="id13-react/src/components/Header.js"
                    className="header-user-avatar-placeholder"
                  >
                    {getInitials(user?.first_name || user?.username)}
                  </div>
                )}
                <span data-easytag="id14-react/src/components/Header.js" className="header-user-name">
                  {user?.first_name || user?.username}
                </span>
                <svg
                  data-easytag="id15-react/src/components/Header.js"
                  className={`header-user-arrow ${isUserMenuOpen ? 'header-user-arrow-open' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div
                  data-easytag="id16-react/src/components/Header.js"
                  className="header-user-dropdown"
                >
                  <Link
                    data-easytag="id17-react/src/components/Header.js"
                    to="/profile"
                    className="header-user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Профиль
                  </Link>
                  <Link
                    data-easytag="id18-react/src/components/Header.js"
                    to="/my-listings"
                    className="header-user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Мои объявления
                  </Link>
                  <button
                    data-easytag="id19-react/src/components/Header.js"
                    className="header-user-dropdown-item header-user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div data-easytag="id20-react/src/components/Header.js" className="header-auth-buttons">
              <Link
                data-easytag="id21-react/src/components/Header.js"
                to="/login"
                className="header-auth-button header-auth-button-secondary"
              >
                Вход
              </Link>
              <Link
                data-easytag="id22-react/src/components/Header.js"
                to="/register"
                className="header-auth-button header-auth-button-primary"
              >
                Регистрация
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            data-easytag="id23-react/src/components/Header.js"
            className="header-mobile-toggle"
            onClick={toggleMenu}
            aria-label="Меню"
          >
            {isMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12h18M3 6h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div data-easytag="id24-react/src/components/Header.js" className="header-mobile-menu">
          <nav data-easytag="id25-react/src/components/Header.js" className="header-mobile-nav">
            <Link
              data-easytag="id26-react/src/components/Header.js"
              to="/"
              className="header-mobile-link"
              onClick={closeMenus}
            >
              Главная
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  data-easytag="id27-react/src/components/Header.js"
                  to="/profile"
                  className="header-mobile-link"
                  onClick={closeMenus}
                >
                  Профиль
                </Link>
                <Link
                  data-easytag="id28-react/src/components/Header.js"
                  to="/my-listings"
                  className="header-mobile-link"
                  onClick={closeMenus}
                >
                  Мои объявления
                </Link>
                <Link
                  data-easytag="id29-react/src/components/Header.js"
                  to="/create-listing"
                  className="header-mobile-link header-mobile-link-primary"
                  onClick={closeMenus}
                >
                  Создать объявление
                </Link>
                {isModerator && (
                  <Link
                    data-easytag="id30-react/src/components/Header.js"
                    to="/admin"
                    className="header-mobile-link"
                    onClick={closeMenus}
                  >
                    Админ-панель
                  </Link>
                )}
                <button
                  data-easytag="id31-react/src/components/Header.js"
                  className="header-mobile-link header-mobile-link-logout"
                  onClick={handleLogout}
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  data-easytag="id32-react/src/components/Header.js"
                  to="/login"
                  className="header-mobile-link"
                  onClick={closeMenus}
                >
                  Вход
                </Link>
                <Link
                  data-easytag="id33-react/src/components/Header.js"
                  to="/register"
                  className="header-mobile-link header-mobile-link-primary"
                  onClick={closeMenus}
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

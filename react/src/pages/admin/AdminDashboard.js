import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/admin';
import StatsCard from '../../components/admin/StatsCard';
import ActivityChart from '../../components/admin/ActivityChart';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard" data-easytag="id1-react/src/pages/admin/AdminDashboard.js">
        <div className="admin-loading" data-easytag="id2-react/src/pages/admin/AdminDashboard.js">
          Загрузка статистики...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard" data-easytag="id3-react/src/pages/admin/AdminDashboard.js">
        <div className="admin-error" data-easytag="id4-react/src/pages/admin/AdminDashboard.js">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" data-easytag="id5-react/src/pages/admin/AdminDashboard.js">
      <div className="admin-header" data-easytag="id6-react/src/pages/admin/AdminDashboard.js">
        <h1 data-easytag="id7-react/src/pages/admin/AdminDashboard.js">Панель администратора</h1>
        <Link 
          to="/" 
          className="admin-back-link"
          data-easytag="id8-react/src/pages/admin/AdminDashboard.js"
        >
          ← Вернуться на сайт
        </Link>
      </div>

      <div className="stats-grid" data-easytag="id9-react/src/pages/admin/AdminDashboard.js">
        <StatsCard
          title="Всего пользователей"
          value={stats.total_users}
          icon="👥"
          color="#3498db"
        />
        <StatsCard
          title="Всего объявлений"
          value={stats.total_listings}
          icon="📋"
          color="#9b59b6"
        />
        <StatsCard
          title="Активных объявлений"
          value={stats.active_listings}
          icon="✓"
          color="#27ae60"
        />
        <StatsCard
          title="На модерации"
          value={stats.pending_listings}
          icon="⏳"
          color="#f39c12"
        />
      </div>

      {stats.activity_chart && stats.activity_chart.length > 0 && (
        <ActivityChart data={stats.activity_chart} />
      )}

      <div className="admin-quick-links" data-easytag="id10-react/src/pages/admin/AdminDashboard.js">
        <h2 data-easytag="id11-react/src/pages/admin/AdminDashboard.js">Быстрые действия</h2>
        <div className="quick-links-grid" data-easytag="id12-react/src/pages/admin/AdminDashboard.js">
          <Link 
            to="/admin/moderation" 
            className="quick-link-card"
            data-easytag="id13-react/src/pages/admin/AdminDashboard.js"
          >
            <div className="quick-link-icon" data-easytag="id14-react/src/pages/admin/AdminDashboard.js">⚖️</div>
            <h3 data-easytag="id15-react/src/pages/admin/AdminDashboard.js">Модерация</h3>
            <p data-easytag="id16-react/src/pages/admin/AdminDashboard.js">
              Проверка и одобрение объявлений
            </p>
            {stats.pending_listings > 0 && (
              <span className="pending-badge" data-easytag="id17-react/src/pages/admin/AdminDashboard.js">
                {stats.pending_listings}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search, PlusCircle, AlertCircle, CheckCircle, PackageSearch, ArrowRight } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    activeLostCount: 0,
    activeFoundCount: 0,
    totalLostCount: 0,
    totalFoundCount: 0,
    recentItems: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get('/items/summary');
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to load dashboard summary', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1 className="welcome-heading">Welcome back, {user?.fullName}!</h1>
          <p className="welcome-sub">
            {user?.department} • ID: {user?.collegeId}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="welcome-actions">
          <Link to="/report-lost" className="btn btn-navy action-btn">
            <PlusCircle size={18} /> Report Lost Item
          </Link>
          <Link to="/report-found" className="btn btn-primary action-btn">
            <PlusCircle size={18} /> Report Found Item
          </Link>
        </div>
      </div>

      {/* Global Quick Search Bar */}
      <div className="search-banner-card">
        <form onSubmit={handleSearchSubmit} className="search-banner-form">
          <div className="search-input-wrapper">
            <Search size={20} className="search-banner-icon" />
            <input
              type="text"
              className="search-banner-input"
              placeholder="Search for lost keys, ID card, backpack, laptop charger..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary search-submit-btn">
            Search Campus
          </button>
        </form>
      </div>

      {/* Stats Summary Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrap lost-color">
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{summary.activeLostCount}</span>
            <span className="stat-label">Active Lost Reports</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap found-color">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{summary.activeFoundCount}</span>
            <span className="stat-label">Active Found Reports</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap total-color">
            <PackageSearch size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{summary.totalLostCount + summary.totalFoundCount}</span>
            <span className="stat-label">Total Campus Items Logged</span>
          </div>
        </div>
      </div>

      {/* Recently Reported Items Section */}
      <div className="recent-items-section">
        <div className="section-title-row">
          <div>
            <h2 className="recent-heading">Recently Reported Items</h2>
            <p className="recent-sub">Latest items posted across all departments and campus areas</p>
          </div>
          <Link to="/browse" className="btn btn-outline btn-sm">
            Browse All Items <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading latest campus reports...</p>
          </div>
        ) : summary.recentItems && summary.recentItems.length > 0 ? (
          <div className="items-grid">
            {summary.recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state-card">
            <PackageSearch size={48} className="empty-state-icon" />
            <h3>No reports logged yet</h3>
            <p>Be the first to report a missing or found item on campus!</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <Link to="/report-lost" className="btn btn-outline btn-sm">Report Lost</Link>
              <Link to="/report-found" className="btn btn-primary btn-sm">Report Found</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

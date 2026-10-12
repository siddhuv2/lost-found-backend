import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search, Filter, X, ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';
import '../styles/BrowsePage.css';

const CATEGORIES = [
  'All',
  'ID Card',
  'Electronics',
  'Books and Notes',
  'Bags',
  'Wallets',
  'Keys',
  'Clothing',
  'Other'
];

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchItems(0);
  }, [type, category, location, sortBy]);

  const fetchItems = async (page = 0) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 9,
        sortBy: 'createdAt',
        direction: 'desc'
      };

      if (type) params.type = type;
      if (category && category !== 'All') params.category = category;
      if (location) params.location = location;
      if (search) params.search = search;

      const res = await api.get('/items', { params });
      setItems(res.data.content);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.number);
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems(0);
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setCategory('');
    setLocation('');
    setSearchParams({});
  };

  return (
    <div className="browse-page-container">
      {/* Top Header */}
      <div className="browse-header">
        <div>
          <h1 className="browse-title">Browse Campus Belongings</h1>
          <p className="browse-sub">Explore and search lost or found items across all campus facilities</p>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="filter-card">
        <form onSubmit={handleSearchSubmit} className="filter-form">
          <div className="search-field">
            <Search size={18} className="filter-icon" />
            <input
              type="text"
              className="filter-input"
              placeholder="Search by item title, details, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-selects">
            <select
              className="filter-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Statuses (Lost & Found)</option>
              <option value="LOST">Lost Belongings</option>
              <option value="FOUND">Found Items</option>
            </select>

            <select
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="text"
              className="filter-select location-filter"
              placeholder="Filter by location (e.g. Library)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>

            {(search || type || category || location) && (
              <button
                type="button"
                className="btn btn-outline btn-sm clear-btn"
                onClick={handleClearFilters}
              >
                <X size={16} /> Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Content */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Filtering items...</p>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="items-grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === 0}
                onClick={() => fetchItems(currentPage - 1)}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() => fetchItems(currentPage + 1)}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state-card">
          <PackageOpen size={48} className="empty-state-icon" />
          <h3>No matching items found</h3>
          <p>Try tweaking your search term, clearing location filters, or checking back later.</p>
          <button onClick={handleClearFilters} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowsePage;

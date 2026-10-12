import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { 
  ArrowLeft, MapPin, Calendar, Tag, User, ShieldCheck, 
  AlertCircle, CheckCircle2, MessageSquare, Clock 
} from 'lucide-react';
import '../styles/ItemDetailsPage.css';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Claim modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/items/${id}`);
      setItem(res.data);
    } catch (err) {
      setError('Item not found or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimError('');
    setClaimSuccess('');

    if (claimDescription.trim().length < 10) {
      setClaimError('Please provide more description explaining why this item is yours (at least 10 characters).');
      return;
    }

    try {
      setClaimSubmitting(true);
      await api.post(`/items/${id}/claims`, {
        claimDescription: claimDescription.trim()
      });
      setClaimSuccess('Claim request submitted successfully! The reporter will review your claim.');
      setTimeout(() => {
        setClaimModalOpen(false);
        fetchItemDetails();
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit claim.';
      setClaimError(msg);
    } finally {
      setClaimSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state" style={{ minHeight: '300px' }}>
        <div className="spinner"></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="empty-state-card" style={{ minHeight: '300px' }}>
        <AlertCircle size={48} className="empty-state-icon" style={{ color: 'var(--danger-600)' }} />
        <h3>{error || 'Item not found'}</h3>
        <button onClick={() => navigate('/browse')} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
          Back to Browse
        </button>
      </div>
    );
  }

  const isOwner = user && user.id === item.createdById;
  const isLost = item.itemType === 'LOST';

  return (
    <div className="details-page-container">
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm back-nav-btn">
        <ArrowLeft size={16} /> Back to previous page
      </button>

      <div className="details-card">
        <div className="details-layout">
          {/* Left Column: Image */}
          <div className="details-media-col">
            {item.imagePath ? (
              <img src={item.imagePath} alt={item.title} className="details-image" />
            ) : (
              <div className="details-image-placeholder">
                <span>{item.category}</span>
                <p>No photo provided by reporter</p>
              </div>
            )}
          </div>

          {/* Right Column: Full Details */}
          <div className="details-content-col">
            <div className="details-header-row">
              <div className="details-badges">
                <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
                  {item.itemType}
                </span>
                <span className="badge badge-active">{item.status}</span>
              </div>
              <span className="details-date">
                Reported on {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="details-title">{item.title}</h1>

            <div className="details-meta-grid">
              <div className="meta-box">
                <Tag size={16} className="meta-icon" />
                <div>
                  <small>Category</small>
                  <strong>{item.category}</strong>
                </div>
              </div>

              <div className="meta-box">
                <MapPin size={16} className="meta-icon" />
                <div>
                  <small>{isLost ? 'Lost At' : 'Found At'}</small>
                  <strong>{item.location}</strong>
                </div>
              </div>

              <div className="meta-box">
                <Calendar size={16} className="meta-icon" />
                <div>
                  <small>Date Observed</small>
                  <strong>{item.eventDate}</strong>
                </div>
              </div>

              <div className="meta-box">
                <User size={16} className="meta-icon" />
                <div>
                  <small>Reported By</small>
                  <strong>{item.createdByName} ({item.createdByDepartment})</strong>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3 className="section-heading">Detailed Description</h3>
              <p className="details-text">{item.description}</p>
            </div>

            {item.additionalDetails && (
              <div className="details-section">
                <h3 className="section-heading">Additional Identifying Notes</h3>
                <p className="details-text note-box">{item.additionalDetails}</p>
              </div>
            )}

            {/* Actions Area */}
            <div className="details-actions">
              {isOwner ? (
                <div className="owner-action-note">
                  <ShieldCheck size={18} />
                  <span>You reported this item. Manage updates or claims in <Link to="/my-reports">My Reports</Link>.</span>
                </div>
              ) : item.status === 'RECOVERED' || item.status === 'RETURNED' || item.status === 'CLOSED' ? (
                <div className="resolved-note">
                  This item is marked as {item.status.toLowerCase()} and is no longer accepting claims.
                </div>
              ) : (
                <button 
                  className="btn btn-primary claim-trigger-btn" 
                  onClick={() => setClaimModalOpen(true)}
                >
                  <MessageSquare size={18} /> Submit Claim Request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Submission Modal Dialog */}
      {claimModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Submit Ownership Claim</h3>
            <p className="modal-sub">
              To verify this item is yours, describe unique identifying features (e.g., serial number, wallpaper, stickers, or specific contents).
            </p>

            {claimError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{claimError}</span>
              </div>
            )}

            {claimSuccess && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{claimSuccess}</span>
              </div>
            )}

            <form onSubmit={handleClaimSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="claimDescription">Proof / Explanation of Ownership *</label>
                <textarea
                  id="claimDescription"
                  rows={4}
                  className="form-control"
                  placeholder="Provide verifiable details known only to the owner..."
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setClaimModalOpen(false)}
                  disabled={claimSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={claimSubmitting}
                >
                  {claimSubmitting ? 'Submitting...' : 'Send Claim Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailsPage;

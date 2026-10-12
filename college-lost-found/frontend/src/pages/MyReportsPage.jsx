import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Trash2, Edit3, CheckCircle, XCircle, Clock, AlertCircle, 
  CheckCircle2, FileText, Inbox, ChevronRight, MessageSquare 
} from 'lucide-react';
import '../styles/MyReportsPage.css';

const MyReportsPage = () => {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'received-claims' | 'my-claims'
  const [reports, setReports] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    eventDate: '',
    status: 'ACTIVE',
    additionalDetails: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete Dialog State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Claim Decision State
  const [decisionClaimId, setDecisionClaimId] = useState(null);
  const [decisionAction, setDecisionAction] = useState(null); // 'ACCEPTED' | 'REJECTED'
  const [responseNote, setResponseNote] = useState('');
  const [decisionLoading, setDecisionLoading] = useState(false);

  // Global notification banner
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsRes, receivedRes, myClaimsRes] = await Promise.all([
        api.get('/items/my-reports'),
        api.get('/claims/received'),
        api.get('/claims/my-claims')
      ]);
      setReports(reportsRes.data);
      setReceivedClaims(receivedRes.data);
      setMyClaims(myClaimsRes.data);
    } catch (err) {
      console.error('Failed to load user activity data', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      location: item.location,
      eventDate: item.eventDate,
      status: item.status,
      additionalDetails: item.additionalDetails || ''
    });
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      setEditLoading(true);
      const form = new FormData();
      form.append('title', editFormData.title);
      form.append('category', editFormData.category);
      form.append('description', editFormData.description);
      form.append('location', editFormData.location);
      form.append('eventDate', editFormData.eventDate);
      form.append('status', editFormData.status);
      form.append('itemType', editingItem.itemType);
      if (editFormData.additionalDetails) {
        form.append('additionalDetails', editFormData.additionalDetails);
      }

      await api.put(`/items/${editingItem.id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage({ type: 'success', text: 'Report updated successfully.' });
      setEditingItem(null);
      loadData();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update report.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/items/${deleteConfirmId}`);
      setMessage({ type: 'success', text: 'Report deleted successfully.' });
      setDeleteConfirmId(null);
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete report.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleProcessDecision = async (e) => {
    e.preventDefault();
    if (!decisionClaimId || !decisionAction) return;

    try {
      setDecisionLoading(true);
      await api.patch(`/claims/${decisionClaimId}/decision`, {
        status: decisionAction,
        responseNote: responseNote.trim()
      });
      setMessage({
        type: 'success',
        text: `Claim marked as ${decisionAction.toLowerCase()}!`
      });
      setDecisionClaimId(null);
      setDecisionAction(null);
      setResponseNote('');
      loadData();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update claim decision.'
      });
    } finally {
      setDecisionLoading(false);
    }
  };

  return (
    <div className="my-reports-container">
      <div className="page-header">
        <h1 className="page-title">My Campus Reports & Claims</h1>
        <p className="page-sub">Track items you have reported and manage ownership verification claims</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={18} /> My Reported Items ({reports.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'received-claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('received-claims')}
        >
          <Inbox size={18} /> Incoming Claims Received ({receivedClaims.filter(c => c.status === 'PENDING').length} pending)
        </button>
        <button
          className={`tab-btn ${activeTab === 'my-claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-claims')}
        >
          <MessageSquare size={18} /> Claims I Submitted ({myClaims.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading reports and claims data...</p>
        </div>
      ) : activeTab === 'reports' ? (
        /* MY REPORTED ITEMS TAB */
        reports.length > 0 ? (
          <div className="reports-table-card">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Item Details</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date Logged</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-item-cell">
                        <strong>{item.title}</strong>
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.itemType === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                        {item.itemType}
                      </span>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <span className={`badge badge-${item.status.toLowerCase().replace('_', '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm action-icon-btn" title="View Details">
                          View
                        </Link>
                        <button
                          className="btn btn-outline btn-sm action-icon-btn"
                          onClick={() => openEditModal(item)}
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm action-icon-btn text-danger"
                          onClick={() => setDeleteConfirmId(item.id)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-card">
            <h3>You haven't reported any lost or found items yet</h3>
            <p>Ready to log something? Choose an option below:</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <Link to="/report-lost" className="btn btn-outline btn-sm">Report Lost</Link>
              <Link to="/report-found" className="btn btn-primary btn-sm">Report Found</Link>
            </div>
          </div>
        )
      ) : activeTab === 'received-claims' ? (
        /* INCOMING CLAIMS RECEIVED TAB */
        receivedClaims.length > 0 ? (
          <div className="claims-list-grid">
            {receivedClaims.map((claim) => (
              <div key={claim.id} className="claim-card">
                <div className="claim-header">
                  <div>
                    <h3 className="claim-item-title">Item: {claim.itemTitle}</h3>
                    <p className="claim-claimant">
                      Claimed by <strong>{claim.claimantName}</strong> ({claim.claimantDepartment} • ID: {claim.claimantCollegeId})
                    </p>
                  </div>
                  <span className={`badge badge-${claim.status.toLowerCase()}`}>
                    {claim.status}
                  </span>
                </div>

                <div className="claim-body">
                  <h4 className="claim-desc-heading">Claimant's Verification Statement:</h4>
                  <p className="claim-statement-text">"{claim.claimDescription}"</p>
                  
                  {claim.responseNote && (
                    <div className="decision-note-box">
                      <strong>Your response note:</strong> {claim.responseNote}
                    </div>
                  )}

                  <div className="claim-date-meta">
                    Submitted on {new Date(claim.createdAt).toLocaleString()}
                  </div>
                </div>

                {claim.status === 'PENDING' && (
                  <div className="claim-actions-row">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setDecisionClaimId(claim.id);
                        setDecisionAction('ACCEPTED');
                        setResponseNote('Claim verified! Please collect the item.');
                      }}
                    >
                      <CheckCircle size={16} /> Accept Claim
                    </button>
                    <button
                      className="btn btn-outline btn-sm text-danger"
                      onClick={() => {
                        setDecisionClaimId(claim.id);
                        setDecisionAction('REJECTED');
                        setResponseNote('Verification details did not match the item.');
                      }}
                    >
                      <XCircle size={16} /> Reject Claim
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-card">
            <h3>No incoming claim requests</h3>
            <p>When someone claims an item you reported, their request will appear here for verification.</p>
          </div>
        )
      ) : (
        /* CLAIMS I SUBMITTED TAB */
        myClaims.length > 0 ? (
          <div className="claims-list-grid">
            {myClaims.map((claim) => (
              <div key={claim.id} className="claim-card">
                <div className="claim-header">
                  <div>
                    <h3 className="claim-item-title">Claim for: {claim.itemTitle}</h3>
                    <Link to={`/items/${claim.itemId}`} className="view-link">View Item Details</Link>
                  </div>
                  <span className={`badge badge-${claim.status.toLowerCase()}`}>
                    {claim.status}
                  </span>
                </div>

                <div className="claim-body">
                  <h4 className="claim-desc-heading">Your Stated Proof:</h4>
                  <p className="claim-statement-text">"{claim.claimDescription}"</p>

                  {claim.responseNote && (
                    <div className="decision-note-box">
                      <strong>Reporter response:</strong> {claim.responseNote}
                    </div>
                  )}

                  <div className="claim-date-meta">
                    Submitted on {new Date(claim.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-card">
            <h3>You haven't claimed any items</h3>
            <p>Browse through lost & found items and submit a claim if you spot your belongings.</p>
            <Link to="/browse" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Browse Items
            </Link>
          </div>
        )
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <h3 className="modal-title">Edit Report: {editingItem.title}</h3>
            {editError && <div className="alert alert-error">{editError}</div>}
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Item Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="CLAIM_PENDING">CLAIM PENDING</option>
                    <option value="RECOVERED">RECOVERED</option>
                    <option value="RETURNED">RETURNED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Event Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={editFormData.eventDate}
                    onChange={(e) => setEditFormData({ ...editFormData, eventDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Details</label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={editFormData.additionalDetails}
                  onChange={(e) => setEditFormData({ ...editFormData, additionalDetails: e.target.value })}
                />
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingItem(null)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                  {editLoading ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <h3 className="modal-title">Delete Report</h3>
            <p className="modal-sub">
              Are you sure you want to permanently delete this report? This action cannot be undone.
            </p>
            <div className="modal-buttons">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Decision Dialog */}
      {decisionClaimId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {decisionAction === 'ACCEPTED' ? 'Accept Claim' : 'Reject Claim'}
            </h3>
            <p className="modal-sub">
              {decisionAction === 'ACCEPTED'
                ? 'Accepting this claim will update the item status and mark other pending claims on this item as resolved.'
                : 'Provide a reason for rejection (e.g. description mismatch).'}
            </p>

            <form onSubmit={handleProcessDecision}>
              <div className="form-group">
                <label className="form-label">Note to Claimant</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  placeholder="Enter a handover instructions or explanation..."
                  required
                />
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setDecisionClaimId(null); setDecisionAction(null); }}
                  disabled={decisionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${decisionAction === 'ACCEPTED' ? 'btn-primary' : 'btn-danger'}`}
                  disabled={decisionLoading}
                >
                  {decisionLoading ? 'Processing...' : `Confirm ${decisionAction}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReportsPage;

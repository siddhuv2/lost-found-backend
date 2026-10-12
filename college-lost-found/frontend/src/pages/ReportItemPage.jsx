import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import '../styles/ItemForm.css';

const CATEGORIES = [
  'ID Card',
  'Electronics',
  'Books and Notes',
  'Bags',
  'Wallets',
  'Keys',
  'Clothing',
  'Other'
];

const ReportItemPage = ({ defaultType = 'LOST' }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    eventDate: new Date().toISOString().split('T')[0],
    additionalDetails: '',
    itemType: defaultType
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isLost = formData.itemType === 'LOST';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must not exceed 5MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('location', formData.location.trim());
      data.append('eventDate', formData.eventDate);
      data.append('itemType', formData.itemType);
      if (formData.additionalDetails) {
        data.append('additionalDetails', formData.additionalDetails.trim());
      }
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await api.post('/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(`Your ${formData.itemType.toLowerCase()} item report has been published successfully!`);
      setTimeout(() => {
        navigate(`/items/${res.data.id}`);
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit report. Please check the inputs.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="form-page-header">
          <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm back-nav-btn">
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="form-title">
              {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
            </h1>
            <p className="form-sub">
              {isLost
                ? 'Fill in the details below to notify campus members and help recover your item.'
                : 'Thank you for being honest! Log the details to help return this item to its rightful owner.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="item-report-form">
          {/* Report Type Selector */}
          <div className="type-toggle-group">
            <label className="form-label">Report Category</label>
            <div className="type-buttons">
              <button
                type="button"
                className={`type-btn ${formData.itemType === 'LOST' ? 'active lost' : ''}`}
                onClick={() => setFormData({ ...formData, itemType: 'LOST' })}
              >
                Lost Belonging
              </button>
              <button
                type="button"
                className={`type-btn ${formData.itemType === 'FOUND' ? 'active found' : ''}`}
                onClick={() => setFormData({ ...formData, itemType: 'FOUND' })}
              >
                Found Item
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="title">Item Name *</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control"
                placeholder={isLost ? "e.g. Blue Dell Laptop Charger" : "e.g. Set of 3 Silver Keys with Red Keychain"}
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="form-control"
              placeholder="Describe color, brand, condition, unique scratches, or contents..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                {isLost ? 'Location Lost *' : 'Location Found *'}
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-control"
                placeholder="e.g. Central Library 2nd Floor, Room 204"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eventDate">
                {isLost ? 'Date Lost *' : 'Date Found *'}
              </label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                className="form-control"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="additionalDetails">
              Additional Identifying Details (Optional)
            </label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              rows={2}
              className="form-control"
              placeholder={isLost 
                ? "e.g. Has a small sticker on top or initials written inside" 
                : "e.g. Can be collected from Room 302 with Student ID proof"}
              value={formData.additionalDetails}
              onChange={handleChange}
            />
          </div>

          {/* Optional Image Upload */}
          <div className="form-group">
            <label className="form-label">Item Photo (Optional)</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="imageUpload"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="file-input-hidden"
                onChange={handleImageChange}
              />
              <label htmlFor="imageUpload" className="file-upload-label">
                <Upload size={24} className="upload-icon" />
                <span>Click to select an image (JPEG, PNG, WEBP, max 5MB)</span>
              </label>
            </div>
            {imagePreview && (
              <div className="preview-container">
                <img src={imagePreview} alt="Selected preview" className="uploaded-preview-img" />
                <button
                  type="button"
                  className="btn btn-outline btn-sm remove-preview-btn"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary submit-item-btn" disabled={loading}>
            {loading ? 'Submitting Report...' : (isLost ? 'Publish Lost Report' : 'Publish Found Report')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportItemPage;

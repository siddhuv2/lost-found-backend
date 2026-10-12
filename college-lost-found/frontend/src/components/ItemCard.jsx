import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';
import '../styles/ItemCard.css';

const ItemCard = ({ item }) => {
  const isLost = item.itemType === 'LOST';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge badge-active">Active</span>;
      case 'CLAIM_PENDING':
        return <span className="badge badge-pending">Claim Pending</span>;
      case 'RECOVERED':
        return <span className="badge badge-resolved">Recovered</span>;
      case 'RETURNED':
        return <span className="badge badge-resolved">Returned</span>;
      case 'CLOSED':
        return <span className="badge badge-resolved">Closed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="item-card">
      <div className="item-card-image-wrap">
        {item.imagePath ? (
          <img src={item.imagePath} alt={item.title} className="item-card-img" />
        ) : (
          <div className="item-card-placeholder">
            <span className="placeholder-text">{item.category}</span>
          </div>
        )}
        <div className="card-top-badges">
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {item.itemType}
          </span>
          {getStatusBadge(item.status)}
        </div>
      </div>

      <div className="item-card-body">
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-desc">{item.description}</p>

        <div className="item-card-meta">
          <div className="meta-line">
            <Tag size={15} className="meta-icon" />
            <span>{item.category}</span>
          </div>
          <div className="meta-line">
            <MapPin size={15} className="meta-icon" />
            <span>{item.location}</span>
          </div>
          <div className="meta-line">
            <Calendar size={15} className="meta-icon" />
            <span>{item.eventDate}</span>
          </div>
        </div>

        <div className="item-card-footer">
          <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm view-details-btn">
            View Details <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, ArrowRight, CheckCircle2, Clock, Users } from 'lucide-react';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span> Official Campus Community Portal
          </div>
          <h1 className="hero-title">
            College Lost & Found <br />
            <span className="text-gradient">Connecting Belongings with Owners</span>
          </h1>
          <p className="hero-subtitle">
            A centralized, secure portal for students, faculty, and campus staff to report missing items,
            log found items, and quickly recover belongings with verified claims.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary hero-btn">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline hero-btn">
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How The Portal Works</h2>
          <p className="section-subtitle">Simple, straightforward steps designed specifically for campus life</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3 className="step-title">Report an Item</h3>
            <p className="step-desc">
              Lost something during class or spotted unattended keys? Submit a report with description, category, and campus location.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">02</div>
            <h3 className="step-title">Browse & Search</h3>
            <p className="step-desc">
              Easily filter through recent items by Lost/Found status, category, date, or specific buildings and labs.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">03</div>
            <h3 className="step-title">Verify & Reconnect</h3>
            <p className="step-desc">
              Submit a private claim detailing proof of ownership. Once the reporter accepts, coordinate a safe handover!
            </p>
          </div>
        </div>
      </section>

      {/* Highlights / Campus Safety Features */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon-box">
              <ShieldCheck size={24} className="feature-icon" />
            </div>
            <div>
              <h4 className="feature-heading">Verified Campus Members</h4>
              <p className="feature-sub">Accessible exclusively to authenticated college students and staff with institutional credentials.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <CheckCircle2 size={24} className="feature-icon" />
            </div>
            <div>
              <h4 className="feature-heading">Private Ownership Claims</h4>
              <p className="feature-sub">Sensitive identifiers remain confidential until a valid claim explanation is approved by the finder.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <Clock size={24} className="feature-icon" />
            </div>
            <div>
              <h4 className="feature-heading">Instant Status Updates</h4>
              <p className="feature-sub">Track active reports, pending claims, and completed returns seamlessly from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="portal-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-brand">
              <strong>CampusFind</strong>
              <span>College Lost & Found Management Portal</span>
            </div>
          </div>
          <div className="footer-right">
            <p>© {new Date().getFullYear()} CampusFind Portal. Built with Java Spring Boot, MySQL & React.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

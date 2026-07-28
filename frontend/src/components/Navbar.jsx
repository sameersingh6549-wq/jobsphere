import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, PlusCircle, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, profile, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 1000, margin: '1rem', borderRadius: '16px' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Briefcase color="#FFFFFF" size={22} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFF' }}>
            Job<span style={{ color: '#818CF8' }}>Sphere</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-links">
          <Link to="/jobs" style={{ color: '#D1D5DB', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
            Find Jobs
          </Link>
          {role === 'Recruiter' && (
            <Link to="/post-job" style={{ color: '#D1D5DB', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
              Post a Job
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/dashboard" style={{ color: '#D1D5DB', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Actions & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Role badge */}
              <span className={`badge ${role === 'Recruiter' ? 'badge-recruiter' : 'badge-candidate'}`}>
                <ShieldCheck size={12} />
                {role}
              </span>

              {/* Profile Pill */}
              <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden' }}>
                  {profile?.Profile_photo ? (
                    <img src={profile.Profile_photo} alt={user?.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user?.first_name ? user.first_name[0].toUpperCase() : user?.username[0].toUpperCase()
                  )}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F3F4F6' }}>
                  {user?.first_name || user?.username}
                </span>
              </Link>

              {/* Logout Button */}
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 0.8rem', borderRadius: '9999px' }} title="Logout">
                <LogOut size={16} color="#9CA3AF" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                Sign up
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

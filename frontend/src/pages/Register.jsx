import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, Briefcase, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    role: 'Candidate',
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const res = await register(formData);
    setSubmitting(false);

    if (res.success) {
      navigate('/login');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '2.5rem 2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', marginBottom: '0.5rem' }}>
            Create your Job<span style={{ color: '#818CF8' }}>Sphere</span> Account
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Join thousands of tech candidates and recruiters today
          </p>
        </div>

        {/* Role Selector Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          
          {/* Candidate Role Card */}
          <div
            onClick={() => handleRoleSelect('Candidate')}
            style={{
              padding: '1.25rem 1rem',
              borderRadius: '14px',
              border: `2px solid ${formData.role === 'Candidate' ? 'var(--primary)' : 'var(--border-color)'}`,
              background: formData.role === 'Candidate' ? 'var(--primary-light)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.5rem'
            }}
          >
            <UserCheck size={28} color={formData.role === 'Candidate' ? '#818CF8' : '#9CA3AF'} />
            <div>
              <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.95rem' }}>Job Candidate</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Apply to top tech roles</div>
            </div>
          </div>

          {/* Recruiter Role Card */}
          <div
            onClick={() => handleRoleSelect('Recruiter')}
            style={{
              padding: '1.25rem 1rem',
              borderRadius: '14px',
              border: `2px solid ${formData.role === 'Recruiter' ? '#8B5CF6' : 'var(--border-color)'}`,
              background: formData.role === 'Recruiter' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.5rem'
            }}
          >
            <Briefcase size={28} color={formData.role === 'Recruiter' ? '#C084FC' : '#9CA3AF'} />
            <div>
              <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.95rem' }}>Employer / Recruiter</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Post jobs & hire talent</div>
            </div>
          </div>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* First Name */}
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="first_name"
                className="form-input form-input-no-icon"
                placeholder="Jane"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Last Name */}
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="form-input form-input-no-icon"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="janedoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  name="confirm_password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }} disabled={submitting}>
            {submitting ? (
              <>
                <div className="spinner"></div> Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818CF8', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

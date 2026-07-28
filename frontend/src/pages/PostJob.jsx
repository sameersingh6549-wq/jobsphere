import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Building2, MapPin, DollarSign, Sparkles, Send } from 'lucide-react';

export default function PostJob() {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [formData, setFormData] = useState({
    Title: '',
    Company_name: '',
    Location: '',
    Salary: '',
    Currency: 'USD',
    Job_type: 'Full Time',
    Experience: '1-3 Years',
    Description: '',
    skills_required: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/jobs/', formData);
      showToast('Job position published successfully!', 'success');
      navigate(`/jobs/${res.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to publish job position.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem 1rem', maxWidth: '750px' }}>
      
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'var(--primary-light)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#A5B4FC',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={14} /> EMPLOYER CONSOLE
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>
            Post a New <span className="gradient-accent">Job Opening</span>
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Publish your opportunity to thousands of verified software engineers & designers
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Job Title */}
          <div className="form-group">
            <label className="form-label">Job Position Title</label>
            <div className="input-wrapper">
              <Briefcase className="input-icon" size={18} />
              <input
                type="text"
                name="Title"
                className="form-input"
                placeholder="e.g. Senior Full-Stack Engineer"
                value={formData.Title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Company Name */}
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <div className="input-wrapper">
                <Building2 className="input-icon" size={18} />
                <input
                  type="text"
                  name="Company_name"
                  className="form-input"
                  placeholder="e.g. TechCorp Inc"
                  value={formData.Company_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <input
                  type="text"
                  name="Location"
                  className="form-input"
                  placeholder="e.g. Remote or San Francisco, CA"
                  value={formData.Location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Annual Salary */}
            <div className="form-group">
              <label className="form-label">Annual Salary</label>
              <div className="input-wrapper">
                <DollarSign className="input-icon" size={18} />
                <input
                  type="number"
                  name="Salary"
                  className="form-input"
                  placeholder="120000"
                  value={formData.Salary}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Currency Selector */}
            <div className="form-group">
              <label className="form-label">Currency Choice</label>
              <select
                name="Currency"
                className="form-input form-input-no-icon"
                value={formData.Currency}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="CAD">C$ CAD (Canadian Dollar)</option>
                <option value="AUD">A$ AUD (Australian Dollar)</option>
                <option value="SGD">S$ SGD (Singapore Dollar)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Job Type */}
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                name="Job_type"
                className="form-input form-input-no-icon"
                value={formData.Job_type}
                onChange={handleChange}
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Experience */}
            <div className="form-group">
              <label className="form-label">Experience Required</label>
              <input
                type="text"
                name="Experience"
                className="form-input form-input-no-icon"
                placeholder="e.g. 3-5 Years"
                value={formData.Experience}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Required Skills */}
          <div className="form-group">
            <label className="form-label">Required Skills (Comma separated)</label>
            <input
              type="text"
              name="skills_required"
              className="form-input form-input-no-icon"
              placeholder="e.g. React, Python, Django, PostgreSQL, Docker"
              value={formData.skills_required}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Job Description</label>
            <textarea
              name="Description"
              className="form-input form-input-no-icon"
              rows={6}
              placeholder="Describe key responsibilities, qualifications, and team culture..."
              value={formData.Description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting} style={{ marginTop: '1rem' }}>
            {submitting ? <div className="spinner"></div> : <><Send size={18} /> Publish Job Opening</>}
          </button>
        </form>

      </div>

    </div>
  );
}

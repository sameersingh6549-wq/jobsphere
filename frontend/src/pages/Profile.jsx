import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Phone, FileText, Upload, Save, Building2, Globe, ShieldCheck, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export default function Profile() {
  const { user, role, showToast, loadProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    Phone: '',
    Bio: '',
    skills: '',
    company_name: '',
    company_website: '',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  const [existingData, setExistingData] = useState({});

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/profile/');
      setExistingData(res.data);
      setFormData({
        Phone: res.data.Phone || '',
        Bio: res.data.Bio || '',
        skills: res.data.skills || '',
        company_name: res.data.company_name || '',
        company_website: res.data.company_website || '',
      });
    } catch (err) {
      showToast('Failed to load profile details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('Phone', formData.Phone);
      data.append('Bio', formData.Bio);
      
      if (role === 'Candidate') {
        data.append('skills', formData.skills);
        if (resumeFile) data.append('resume', resumeFile);
      } else {
        data.append('company_name', formData.company_name);
        data.append('company_website', formData.company_website);
        if (companyLogo) data.append('company_logo', companyLogo);
      }

      if (profilePhoto) data.append('Profile_photo', profilePhoto);

      await api.put('/accounts/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('Profile updated successfully!', 'success');
      await loadProfile(); // Update global auth context
      fetchProfile(); // Refresh page data
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem 1rem', maxWidth: '800px' }}>
      
      {/* Profile Header Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Avatar Display */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#FFF',
          border: '3px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
        }}>
          {existingData.Profile_photo ? (
            <img src={existingData.Profile_photo} alt={user?.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.first_name ? user.first_name[0].toUpperCase() : user?.username[0].toUpperCase()
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
              {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
            </h1>
            <span className={`badge ${role === 'Recruiter' ? 'badge-recruiter' : 'badge-candidate'}`}>
              <ShieldCheck size={14} /> {role}
            </span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            {user?.email} • {role === 'Recruiter' ? 'Employer Account' : 'Candidate Account'}
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginBottom: '1.5rem' }}>
          Account & Profile Settings
        </h2>

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* First Name (Read-only) */}
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="form-input form-input-no-icon" value={user?.first_name || ''} disabled style={{ opacity: 0.7 }} />
            </div>
            {/* Last Name (Read-only) */}
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-input form-input-no-icon" value={user?.last_name || ''} disabled style={{ opacity: 0.7 }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Email (Read-only) */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="text" className="form-input form-input-no-icon" value={user?.email || ''} disabled style={{ opacity: 0.7 }} />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={18} />
                <input
                  type="text"
                  name="Phone"
                  className="form-input"
                  placeholder="+1 234 567 8900"
                  value={formData.Phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div className="form-group">
            <label className="form-label">Profile Avatar Photo</label>
            <div className="input-wrapper">
              <ImageIcon className="input-icon" size={18} />
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
                style={{ padding: '0.65rem 1rem 0.65rem 2.75rem' }}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Professional Bio / Overview</label>
            <textarea
              name="Bio"
              className="form-input form-input-no-icon"
              rows={4}
              placeholder="Tell employers or candidates about yourself..."
              value={formData.Bio}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Candidate-Specific Fields */}
          {role === 'Candidate' && (
            <>
              <div className="form-group">
                <label className="form-label">Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  className="form-input form-input-no-icon"
                  placeholder="e.g. React, Python, Django, PostgreSQL, Docker"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resume Document (PDF, DOC, DOCX)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="form-input form-input-no-icon"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  style={{ padding: '0.65rem 1rem' }}
                />
                {existingData.resume && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#9CA3AF' }}>Current Resume: </span>
                    <a href={existingData.resume} target="_blank" rel="noreferrer" style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none' }}>
                      View / Download Resume
                    </a>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Recruiter-Specific Fields */}
          {role === 'Recruiter' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <div className="input-wrapper">
                    <Building2 className="input-icon" size={18} />
                    <input
                      type="text"
                      name="company_name"
                      className="form-input"
                      placeholder="e.g. TechCorp Inc"
                      value={formData.company_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Company Website</label>
                  <div className="input-wrapper">
                    <Globe className="input-icon" size={18} />
                    <input
                      type="url"
                      name="company_website"
                      className="form-input"
                      placeholder="https://techcorp.example.com"
                      value={formData.company_website}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-input form-input-no-icon"
                  onChange={(e) => setCompanyLogo(e.target.files[0])}
                  style={{ padding: '0.65rem 1rem' }}
                />
                {existingData.company_logo && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#9CA3AF' }}>Current Logo: </span>
                    <a href={existingData.company_logo} target="_blank" rel="noreferrer" style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none' }}>
                      View Logo Image
                    </a>
                  </div>
                )}
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting} style={{ marginTop: '1.5rem' }}>
            {submitting ? <div className="spinner"></div> : <><Save size={18} /> Save Profile Changes</>}
          </button>

        </form>

      </div>

    </div>
  );
}

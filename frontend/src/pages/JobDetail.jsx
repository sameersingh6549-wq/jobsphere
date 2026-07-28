import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, DollarSign, Briefcase, Calendar, Building2, CheckCircle2, ArrowLeft, Send, X, ShieldCheck } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role, showToast } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}/`);
      setJob(res.data);
    } catch (err) {
      showToast('Failed to load job position details.', 'error');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in as a candidate to apply.', 'warning');
      navigate('/login');
      return;
    }

    if (role === 'Recruiter') {
      showToast('Recruiters cannot apply for jobs. Please log in as a candidate.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('cover_letter', coverLetter);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await api.post(`/jobs/${id}/apply/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('Application submitted successfully!', 'success');
      setApplyModalOpen(false);
      fetchJobDetail(); // Refresh job state
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit application.';
      showToast(msg, 'error');
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

  if (!job) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem 1rem', maxWidth: '1000px' }}>
      
      {/* Back link */}
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#9CA3AF', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to all jobs
      </Link>

      {/* Main Glass Header Card */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.8rem',
              color: '#A5B4FC'
            }}>
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.Company_name} style={{ width: '100%', height: '100%', borderRadius: '18px', objectFit: 'cover' }} />
              ) : (
                job.Company_name[0].toUpperCase()
              )}
            </div>

            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', marginBottom: '0.4rem' }}>
                {job.Title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9CA3AF', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#F3F4F6', fontWeight: 700 }}>{job.Company_name}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={16} color="#818CF8" /> {job.Location}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={16} color="#22D3EE" /> {job.Job_type}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div>
            {role === 'Recruiter' ? (
              <div className="btn" style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#C084FC', cursor: 'default' }}>
                <ShieldCheck size={18} /> Recruiter View Only
              </div>
            ) : job.has_applied ? (
              <div className="btn" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', cursor: 'default' }}>
                <CheckCircle2 size={18} /> Already Applied
              </div>
            ) : (
              <button onClick={() => setApplyModalOpen(true)} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                Apply for this Position
              </button>
            )}
          </div>

        </div>

        {/* Metadata Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600 }}>ANNUAL SALARY</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34D399' }}>{job.currency_symbol || '$'} {job.Salary.toLocaleString()} / yr</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600 }}>EXPERIENCE REQUIRED</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{job.Experience}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600 }}>APPLICANTS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818CF8' }}>{job.applicant_count} Candidate(s)</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600 }}>POSTED BY</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{job.posted_by_username}</div>
          </div>
        </div>

      </div>

      {/* Main Content Details */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: '1rem' }}>Job Description</h2>
        <div style={{ color: '#D1D5DB', fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: '2rem' }}>
          {job.Description}
        </div>

        {job.skills_required && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '0.75rem' }}>Required Technical Skills</h3>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {job.skills_required.split(',').map((skill, i) => (
                <span key={i} style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', background: 'var(--primary-light)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#A5B4FC', fontWeight: 600, fontSize: '0.85rem' }}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal Dialog */}
      {applyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '550px', padding: '2rem', position: 'relative' }}>
            
            <button onClick={() => setApplyModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginBottom: '0.5rem' }}>
              Apply for {job.Title}
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Submit your application to {job.Company_name}
            </p>

            <form onSubmit={handleApplySubmit}>
              {/* Cover Letter */}
              <div className="form-group">
                <label className="form-label">Cover Letter / Note to Recruiter</label>
                <textarea
                  className="form-input form-input-no-icon"
                  rows={4}
                  placeholder="Introduce yourself and explain why you're a great fit for this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Resume File Upload */}
              <div className="form-group">
                <label className="form-label">Upload Resume (PDF, DOC, DOCX)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="form-input form-input-no-icon"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  style={{ padding: '0.6rem 1rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginTop: '0.35rem' }}>
                  If omitted, your profile resume will be attached automatically.
                </span>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={submitting} style={{ marginTop: '1rem' }}>
                {submitting ? <div className="spinner"></div> : <><Send size={18} /> Submit Application</>}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, UserCheck, FileText, CheckCircle2, Clock, XCircle, ChevronRight, Eye, ShieldCheck, Download } from 'lucide-react';

export default function Dashboard() {
  const { role, user, showToast } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected job for recruiter applicant review
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (role === 'Recruiter') {
        const res = await api.get('/jobs/my-posted-jobs/');
        setData(res.data.results || []);
      } else {
        const res = await api.get('/jobs/my-applications/');
        setData(res.data.results || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [role]);

  const handleViewApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    setApplicantsLoading(true);
    try {
      const res = await api.get(`/jobs/${jobId}/applicants/`);
      setApplicants(res.data || []);
    } catch (err) {
      showToast('Failed to load applicants for this job.', 'error');
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/jobs/applications/${appId}/status/`, { status: newStatus });
      showToast(`Application status updated to ${newStatus}`, 'success');
      // Update local state
      setApplicants((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      showToast('Failed to update application status.', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Applied: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', border: 'rgba(99, 102, 241, 0.3)' },
      Reviewing: { bg: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },
      Shortlisted: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: 'rgba(16, 185, 129, 0.3)' },
      Rejected: { bg: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
      Hired: { bg: 'rgba(139, 92, 246, 0.2)', color: '#C084FC', border: 'rgba(139, 92, 246, 0.4)' },
    };
    const current = badges[status] || badges.Applied;
    return (
      <span style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', background: current.bg, border: `1px solid ${current.border}`, color: current.color, fontSize: '0.8rem', fontWeight: 700 }}>
        {status}
      </span>
    );
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem 1rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className={`badge ${role === 'Recruiter' ? 'badge-recruiter' : 'badge-candidate'}`}>
              <ShieldCheck size={14} /> {role} Dashboard
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            Welcome, {user?.first_name || user?.username}!
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            {role === 'Recruiter' ? 'Manage your posted job openings and candidate pipelines' : 'Track the status of your active job applications'}
          </p>
        </div>

        {role === 'Recruiter' && (
          <Link to="/post-job" className="btn btn-primary">
            + Post New Job
          </Link>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
        </div>
      ) : role === 'Recruiter' ? (
        /* RECRUITER DASHBOARD */
        <div style={{ display: 'grid', gridTemplateColumns: selectedJobId ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          
          {/* Posted Jobs Table */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF', marginBottom: '1.25rem' }}>
              My Posted Job Openings
            </h2>

            {data.length === 0 ? (
              <p style={{ color: '#9CA3AF' }}>You have not posted any jobs yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.map((job) => (
                  <div key={job.id} style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 700 }}>{job.Title}</h4>
                      <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                        {job.Job_type} • {job.currency_symbol || '$'} {job.Salary.toLocaleString()} • {job.applicant_count} Applicants
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewApplicants(job.id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      Applicants ({job.applicant_count}) <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applicant Management Drawer */}
          {selectedJobId && (
            <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>
                  Candidates Pipeline
                </h2>
                <button onClick={() => setSelectedJobId(null)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>Close</button>
              </div>

              {applicantsLoading ? (
                <div className="spinner" style={{ margin: '2rem auto' }}></div>
              ) : applicants.length === 0 ? (
                <p style={{ color: '#9CA3AF' }}>No candidate has applied to this position yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {applicants.map((app) => (
                    <div key={app.id} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#FFF', fontSize: '1rem' }}>{app.applicant_name}</div>
                          <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{app.applicant_email} {app.applicant_phone && `• ${app.applicant_phone}`}</div>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      {app.cover_letter && (
                        <div style={{ fontSize: '0.85rem', color: '#CBD5E1', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.8rem', borderRadius: '8px' }}>
                          "{app.cover_letter}"
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        {app.applicant_resume ? (
                          <a href={app.applicant_resume} target="_blank" rel="noreferrer" style={{ color: '#818CF8', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Download size={14} /> Download Resume
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>No resume uploaded</span>
                        )}

                        <select
                          className="form-input form-input-no-icon"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* CANDIDATE DASHBOARD */
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF', marginBottom: '1.5rem' }}>
            My Applied Jobs ({data.length})
          </h2>

          {data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#9CA3AF', marginBottom: '1rem' }}>You haven't submitted any job applications yet.</p>
              <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.map((app) => (
                <div key={app.id} style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {app.job_details?.Title}
                    </h3>
                    <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                      {app.job_details?.Company_name} • {app.job_details?.Location} • Applied on {new Date(app.Applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getStatusBadge(app.status)}
                    <Link to={`/jobs/${app.job}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                      View Job
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, MapPin, DollarSign, Briefcase, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Sparkles, Building2 } from 'lucide-react';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [ordering, setOrdering] = useState('-Created_at');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (jobType) params.append('job_type', jobType);
      if (location) params.append('location', location);
      if (minSalary) params.append('min_salary', minSalary);
      if (ordering) params.append('ordering', ordering);
      params.append('page', page);

      const res = await api.get(`/jobs/?${params.toString()}`);
      setJobs(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, jobType, ordering]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setJobType('');
    setLocation('');
    setMinSalary('');
    setOrdering('-Created_at');
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / 10) || 1;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem 4rem 1rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
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
          <Sparkles size={14} /> EXPLORE TECH CAREERS
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFF' }}>
          Explore Verified <span className="gradient-accent">Job Opportunities</span>
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>
          Discover remote & onsite roles from top verified engineering teams
        </p>
      </div>

      {/* Main Grid: Sidebar Filters + Jobs Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }} className="job-list-grid">
        
        {/* Sidebar Filters */}
        <aside className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} color="#818CF8" /> Filters
            </h3>
            <button onClick={handleResetFilters} style={{ background: 'none', border: 'none', color: '#818CF8', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
              Reset All
            </button>
          </div>

          <form onSubmit={handleSearchSubmit}>
            {/* Search Query */}
            <div className="form-group">
              <label className="form-label">Search Keyword</label>
              <div className="input-wrapper">
                <Search className="input-icon" size={16} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Title, skill, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={16} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Remote or San Francisco"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Job Type Selector */}
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                className="form-input form-input-no-icon"
                value={jobType}
                onChange={(e) => { setJobType(e.target.value); setPage(1); }}
                style={{ cursor: 'pointer' }}
              >
                <option value="">All Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Minimum Salary */}
            <div className="form-group">
              <label className="form-label">Min Annual Salary ($)</label>
              <div className="input-wrapper">
                <DollarSign className="input-icon" size={16} />
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 80000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
              </div>
            </div>

            {/* Sort Order */}
            <div className="form-group">
              <label className="form-label">Sort By</label>
              <div className="input-wrapper">
                <ArrowUpDown className="input-icon" size={16} />
                <select
                  className="form-input"
                  value={ordering}
                  onChange={(e) => { setOrdering(e.target.value); setPage(1); }}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="-Created_at">Newest First</option>
                  <option value="-Salary">Highest Salary</option>
                  <option value="Salary">Lowest Salary</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Jobs Feed */}
        <div>
          
          {/* Top Info Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              Showing <strong style={{ color: '#FFF' }}>{jobs.length}</strong> of <strong style={{ color: '#FFF' }}>{totalCount}</strong> available roles
            </p>
          </div>

          {/* Loading State Skeleton */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-panel" style={{ padding: '1.75rem', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="spinner"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            /* Empty State */
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <Building2 size={48} color="#6B7280" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#FFF', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No jobs match your criteria</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try adjusting your search keywords, location filter, or salary parameters.
              </p>
              <button onClick={handleResetFilters} className="btn btn-secondary">
                Reset Filters
              </button>
            </div>
          ) : (
            /* Job Cards Feed */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="glass-panel"
                  style={{
                    padding: '1.75rem',
                    transition: 'var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    
                    {/* Left Details */}
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                      {/* Company Avatar / Logo */}
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        color: '#A5B4FC',
                        flexShrink: 0
                      }}>
                        {job.company_logo ? (
                          <img src={job.company_logo} alt={job.Company_name} style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover' }} />
                        ) : (
                          job.Company_name[0].toUpperCase()
                        )}
                      </div>

                      <div>
                        <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ color: '#FFF', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', transition: 'var(--transition)' }}>
                            {job.Title}
                          </h3>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', color: '#9CA3AF', fontSize: '0.875rem' }}>
                          <span style={{ color: '#D1D5DB', fontWeight: 600 }}>{job.Company_name}</span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <MapPin size={14} color="#818CF8" /> {job.Location}
                          </span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Briefcase size={14} color="#22D3EE" /> {job.Job_type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Salary & CTA */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34D399' }}>
                        {job.currency_symbol || '$'} {job.Salary.toLocaleString()}<span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 500 }}>/yr</span>
                      </div>
                      <Link to={`/jobs/${job.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                        View Details
                      </Link>
                    </div>

                  </div>

                  {/* Skills Pills */}
                  {job.skills_required && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      {job.skills_required.split(',').map((skill, i) => (
                        <span key={i} style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 500 }}>
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                <ChevronLeft size={18} /> Previous
              </button>
              <span style={{ color: '#9CA3AF', fontSize: '0.9rem', fontWeight: 600 }}>
                Page <strong style={{ color: '#FFF' }}>{page}</strong> of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

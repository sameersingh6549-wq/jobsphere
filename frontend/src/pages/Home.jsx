import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, TrendingUp, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <section className="container" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', textAlign: 'center' }}>
        
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          background: 'var(--primary-light)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#A5B4FC',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}>
          <TrendingUp size={16} color="#818CF8" /> #1 MODERN FULL-STACK TECH JOB MARKETPLACE
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
          Find Your Next <span className="gradient-accent">Dream Tech Role</span> <br />
          Or Hire Exceptional Talent.
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '1.15rem', color: '#9CA3AF', maxWidth: '680px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
          Connect with top tech companies hiring worldwide. Discover verified engineering, design, and product management jobs with transparent salary ranges.
        </p>

        {/* Quick Search Bar Box */}
        <div className="glass-panel" style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: '0.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}>
          <div className="input-wrapper" style={{ flex: '1 1 240px' }}>
            <Search className="input-icon" size={18} />
            <input type="text" className="form-input" placeholder="Job title, skill, or company..." />
          </div>
          <div className="input-wrapper" style={{ flex: '1 1 200px' }}>
            <MapPin className="input-icon" size={18} />
            <input type="text" className="form-input" placeholder="Location or Remote" />
          </div>
          <Link to="/jobs" className="btn btn-primary" style={{ padding: '0.85rem 2rem', flex: '0 0 auto' }}>
            Search Jobs <ArrowRight size={18} />
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '4rem auto 0 auto' }}>
          <div className="glass-panel" style={{ padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>10k+</div>
            <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600 }}>Active Job Postings</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818CF8' }}>500+</div>
            <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600 }}>Verified Companies</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22D3EE' }}>98%</div>
            <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600 }}>Recruiter Response Rate</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C084FC' }}>24h</div>
            <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600 }}>Average Hiring Cycle</div>
          </div>
        </div>

      </section>

      {/* Featured Categories */}
      <section className="container" style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>Popular Tech Categories</h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>Explore roles by technical specialization</p>
          </div>
          <Link to="/jobs" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            View All Jobs <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {[
            { title: 'Full-Stack Development', count: '3,420 Jobs', icon: <Briefcase color="#818CF8" size={24} /> },
            { title: 'Backend Engineering', count: '2,150 Jobs', icon: <Building2 color="#22D3EE" size={24} /> },
            { title: 'Frontend & UI/UX', count: '1,890 Jobs', icon: <ShieldCheck color="#C084FC" size={24} /> },
            { title: 'AI & Data Science', count: '1,240 Jobs', icon: <TrendingUp color="#34D399" size={24} /> },
          ].map((cat, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '1.5rem', transition: 'var(--transition)', cursor: 'pointer' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '0.3rem' }}>{cat.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

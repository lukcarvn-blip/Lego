import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, ChevronRight, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { blogPosts, language } = useStore();
  const navigate = useNavigate();

  const post = blogPosts.find(p => p.id === id);
  const related = blogPosts.filter(p => p.id !== id).slice(0, 3);

  if (!post) {
    return (
      <div style={{ paddingTop: '160px', textAlign: 'center', minHeight: '100vh' }}>
        <h2>Bài viết không tồn tại</h2>
        <Link to="/news" style={{ color: 'var(--color-accent)' }}>← Quay lại Tin Tức</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '130px', paddingBottom: '5rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}
        >
          <Link to="/" style={{ color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Trang Chủ' : 'Home'}</Link>
          <ChevronRight size={14} />
          <Link to="/news" style={{ color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Tin Tức' : 'News'}</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--color-text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>{post.title}</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '2rem' }}
        >
          <p style={{ color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} /> {post.date}
            <span style={{ opacity: 0.4 }}>•</span>
            <Clock size={14} />
            {language === 'vi' ? '5 phút đọc' : '5 min read'}
          </p>
          <h1 style={{ fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>
            {post.title}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.7, borderLeft: '3px solid var(--color-accent)', paddingLeft: '1.25rem' }}>
            {post.excerpt}
          </p>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ marginBottom: '3rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}
        >
          <img
            src={post.image}
            alt={post.title}
            style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
          />
        </motion.div>

        {/* Article body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ marginBottom: '4rem' }}
        />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginBottom: '5rem' }}
        >
          <button
            onClick={() => navigate('/news')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
              color: 'var(--color-text)', padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-full)', cursor: 'pointer',
              fontSize: '0.95rem', fontWeight: 600, transition: 'all 0.2s'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'; }}
          >
            <ArrowLeft size={18} />
            {language === 'vi' ? 'Quay Lại Tin Tức' : 'Back to News'}
          </button>
        </motion.div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontWeight: 800, marginBottom: '2rem' }}>
              {language === 'vi' ? 'Bài Viết Liên Quan' : 'Related Articles'}
            </h2>
            <div className="nd-related-grid">
              {related.map((rel, i) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link to={`/news/${rel.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div
                      className="glass-panel"
                      style={{ overflow: 'hidden', transition: 'border-color 0.3s, transform 0.3s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                    >
                      <div style={{ height: '150px', overflow: 'hidden' }}>
                        <img src={rel.image} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <p style={{ color: 'var(--color-accent)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{rel.date}</p>
                        <h4 style={{ fontWeight: 700, lineHeight: 1.4,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>{rel.title}</h4>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .article-body {
          font-size: 1.05rem;
          line-height: 1.85;
          color: var(--color-text);
        }
        .article-body h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 2.5rem 0 1rem;
          color: var(--color-text);
        }
        .article-body h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 2rem 0 0.75rem;
          color: var(--color-accent);
        }
        .article-body p {
          margin-bottom: 1.25rem;
          color: rgba(255,255,255,0.85);
        }
        .article-body ul, .article-body ol {
          margin: 1rem 0 1.5rem 1.5rem;
        }
        .article-body li {
          margin-bottom: 0.6rem;
          color: rgba(255,255,255,0.8);
        }
        .article-body strong {
          color: #fff;
          font-weight: 700;
        }
        .article-body img {
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
        }
        .article-body blockquote {
          border-left: 4px solid var(--color-accent);
          padding: 0.75rem 1.5rem;
          margin: 1.5rem 0;
          background: var(--glass-bg);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          font-style: italic;
          color: var(--color-text-muted);
        }
        @media (max-width: 767px) {
          .article-body h2 { font-size: 1.3rem; }
        }
        .nd-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1023px) {
          .nd-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 639px) {
          .nd-related-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

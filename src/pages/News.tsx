import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const News = () => {
  const { blogPosts, language } = useStore();

  return (
    <div style={{ paddingTop: '140px', paddingBottom: '5rem', minHeight: '100vh' }}>
      {/* SEO meta (title handled by page title) */}
      <title>Tin Tức | LEGATO - Mô Hình In 3D Cao Cấp</title>

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <p style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.15em', marginBottom: '1rem' }}>
            {language === 'vi' ? 'BLOG & TIN TỨC' : 'BLOG & NEWS'}
          </p>
          <h1 className="hero-title" style={{ fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            {language === 'vi' ? 'Góc Chia Sẻ Từ LEGATO' : 'Stories From LEGATO'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {language === 'vi'
              ? 'Khám phá quy trình chế tác, xu hướng sưu tầm và bí quyết decor không gian sống với mô hình in 3D cao cấp.'
              : 'Explore our crafting process, collection trends and interior design tips with premium 3D printed figures.'}
          </p>
        </motion.div>

        {/* Featured Post (first) */}
        {blogPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ marginBottom: '4rem' }}
          >
            <Link to={`/news/${blogPosts[0].id}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div className="news-featured-grid glass-panel" style={{
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ position: 'relative', overflow: 'hidden', minHeight: '380px' }}>
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{
                    position: 'absolute', top: '1rem', left: '1rem',
                    background: 'var(--color-accent)', color: '#000',
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700
                  }}>
                    {language === 'vi' ? 'NỔI BẬT' : 'FEATURED'}
                  </div>
                </div>
                <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} /> {blogPosts[0].date}
                  </p>
                  <h2 style={{ fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.3 }}>
                    {blogPosts[0].title}
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '1rem' }}>
                    {blogPosts[0].excerpt}
                  </p>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                    {language === 'vi' ? 'Đọc Bài Viết' : 'Read Article'} <ChevronRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grid of remaining posts */}
        <div className="news-articles-grid">
          {blogPosts.slice(1).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link to={`/news/${post.id}`} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
                <div
                  className="glass-panel"
                  style={{
                    overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
                    transition: 'border-color 0.3s, transform 0.3s',
                    border: '1px solid var(--glass-border)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  <div style={{ overflow: 'hidden', height: '200px' }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={12} /> {post.date}
                    </p>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {post.title}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1,
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {post.excerpt}
                    </p>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', marginTop: '1.25rem' }}>
                      {language === 'vi' ? 'Đọc Thêm' : 'Read More'} <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .news-featured-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .news-articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        @media (max-width: 1023px) {
          .news-featured-grid {
            grid-template-columns: 1fr;
          }
          .news-featured-grid > div:first-child {
            min-height: 260px !important;
          }
          .news-articles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 639px) {
          .news-articles-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

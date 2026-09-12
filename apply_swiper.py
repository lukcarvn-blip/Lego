import re

with open('src/pages/Home.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Imports
import_str = """import { Heart, Clock, ChevronRight, ChevronLeft, ShieldCheck, Zap, Diamond, Sparkles, ShoppingCart, Loader2, LayoutGrid, LayoutList, ArrowRight, Shield, Moon, Star, Wand2, Swords, PawPrint, Rocket, Castle, Building2, Settings } from 'lucide-react';"""
new_import = import_str + """
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';"""
code = code.replace(import_str, new_import)

# 2. Swiper implementation
old_grid = """<div className="home-news-grid">
          {blogPosts.slice(0, 4).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={`/news/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  className="glass-panel"
                  style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '110px', transition: 'border-color 0.3s, transform 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,222,128,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: '110px', flexShrink: 0, overflow: 'hidden' }}>
                    <img src={post.image} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem' }}>{post.date}</p>
                    <h3 style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                      fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.3rem',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden'
                    }}>
                      {post.title}
                    </h3>
                    <p style={{
                      color: 'var(--color-text-muted)', fontSize: '0.75rem', lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden'
                    }}>
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>"""

new_grid = """<Swiper
          modules={[Grid, Pagination, Autoplay]}
          spaceBetween={16}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            0: {
              slidesPerView: 1.1,
              grid: { rows: 2, fill: 'row' },
              spaceBetween: 12
            },
            640: {
              slidesPerView: 2,
              grid: { rows: 1 },
              spaceBetween: 16
            },
            1024: {
              slidesPerView: 4,
              grid: { rows: 1 },
              spaceBetween: 24
            }
          }}
          className="home-news-swiper"
          style={{ paddingBottom: '2.5rem', width: '100%', margin: '0 -1rem', padding: '0 1rem 2.5rem 1rem' }}
        >
          {blogPosts.slice(0, 4).map((post, i) => (
            <SwiperSlide key={post.id} style={{ height: 'auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ height: '100%' }}
              >
                <Link to={`/news/${post.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div
                    className="glass-panel"
                    style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '110px', transition: 'border-color 0.3s, transform 0.25s', width: '100%' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,222,128,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: '110px', flexShrink: 0, overflow: 'hidden' }}>
                      <img src={post.image} onError={(e) => { e.currentTarget.src = '/images/fallback-logo.jpg'; }} alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                      <p style={{ color: 'var(--color-accent)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem' }}>{post.date}</p>
                      <h3 style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.3rem',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden'
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        color: 'var(--color-text-muted)', fontSize: '0.75rem', lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden'
                      }}>
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>"""

code = code.replace(old_grid, new_grid)

# 3. Clean CSS
code = re.sub(r'\.home-news-grid\s*\{[^}]*\}', '', code)
code = re.sub(r'\.home-news-grid\s*>\s*div\s*\{[^}]*\}', '', code)
code = re.sub(r'\.home-news-grid::-webkit-scrollbar\s*\{[^}]*\}', '', code)

# 4. Add swiper CSS overrides
style_end = '      `}</style>\n    </div>\n  );\n};'
new_style_end = """        /* Swiper overrides */
        .swiper-pagination-bullet { background: rgba(255,255,255,0.4); }
        .swiper-pagination-bullet-active { background: var(--color-accent); }
        .home-news-swiper .swiper-wrapper { align-items: stretch; }
      `}</style>
    </div>
  );
};"""

code = code.replace(style_end, new_style_end)

with open('src/pages/Home.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

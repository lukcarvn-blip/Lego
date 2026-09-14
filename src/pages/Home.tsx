import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination, Autoplay, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { LegoHeadIcon } from '../components/LegoHeadIcon';
import { ProductCard } from '../components/ProductCard';
import { Heart, Clock, ChevronRight, ChevronLeft, ShieldCheck, Zap, Diamond, Sparkles, ShoppingCart, Loader2, LayoutGrid, LayoutList, ArrowRight, Shield, Moon, Star, Wand2, Swords, PawPrint, Rocket, Castle, Building2, Settings } from 'lucide-react';


const getSizeDetails = (sizeStr: string) => {
  if (sizeStr.includes('300')) return { label: '300%', height: '21 cm', scale: 0.6 };
  if (sizeStr.includes('400')) return { label: '400%', height: '28 cm', scale: 0.8 };
  if (sizeStr.includes('1000')) return { label: '1000%', height: '70 cm', scale: 1.2 };
  return { label: sizeStr, height: '', scale: 0.8 };
};

const showcaseCharacters = [
  { name: 'Batman', quote: 'Ta là sự báo thù, ta là bóng đêm... Ta là Batman!' },
  { name: 'Doctor Doom', quote: 'Doom là đấng tối cao! Không thế lực nào sánh kịp ta!' },
  { name: 'Iron Man', quote: 'Thiên tài, tỷ phú, dân chơi, nhà từ thiện.' },
  { name: 'Spider-Man', quote: 'Sức mạnh càng lớn, trách nhiệm càng cao.' },
  { name: 'Supergirl', quote: 'Hy vọng, sự trợ giúp và lòng trắc ẩn dành cho tất cả.' },
  { name: 'Buzz Lightyear', quote: 'Vươn tới vô cực, và xa hơn thế nữa!' },
  { name: 'Wolverine', quote: 'Ta là kẻ giỏi nhất, nhưng việc ta làm lại chẳng tốt đẹp gì.' },
  { name: 'Doctor Strange', quote: 'Vũ trụ bao la chứa đựng vô vàn những phép màu bí ẩn.' },
  { name: 'Loki', quote: 'Ta là Loki xứ Asgard. Và ta mang trên vai một sứ mệnh vinh quang.' },
  { name: 'Goku', quote: 'Sức mạnh của ta đến từ khao khát bảo vệ những người ta yêu thương!' }
];


const TypewriterText = ({ text, isActive }: { text: string, isActive: boolean }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    if (isActive) {
      setDisplayedText('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayedText('');
    }
  }, [text, isActive]);
  return <span>{displayedText}<span className="blink-cursor">_</span></span>;
};

export const Home = () => {
  const { products, blogPosts, t, language, settings, formatPrice, addToCart, showToast } = useStore();

  const progressCircle = useRef<SVGCircleElement>(null);
  const progressText = useRef<HTMLSpanElement>(null);

  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    if (progressCircle.current) {
      const radius = 14;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference * progress;
      progressCircle.current.style.strokeDashoffset = String(offset);
    }
    if (progressText.current) {
      progressText.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
    
    // Handle synced animations
    const swiperEl = document.querySelector('.hero-blog-swiper');
    if (swiperEl) {
      if (time <= 1200 && time > 0) {
        if (!swiperEl.classList.contains('is-flicker-out')) {
          swiperEl.classList.add('is-flicker-out');
          swiperEl.classList.remove('is-flicker-in');
          swiperEl.classList.remove('is-glitching');
        }
      } else if ((time <= 10000 && time > 9800) || (time <= 5000 && time > 4800)) {
        if (!swiperEl.classList.contains('is-glitching')) {
          swiperEl.classList.add('is-glitching');
          swiperEl.classList.remove('is-flicker-in');
          swiperEl.classList.remove('is-flicker-out');
        }
      } else if (time > 14200) {
        if (!swiperEl.classList.contains('is-flicker-in')) {
          swiperEl.classList.add('is-flicker-in');
          swiperEl.classList.remove('is-flicker-out');
          swiperEl.classList.remove('is-glitching');
        }
      } else if (time > 1200 && time <= 14200 && (time > 10000 || time <= 9800) && (time > 5000 || time <= 4800)) {
        swiperEl.classList.remove('is-glitching');
        swiperEl.classList.remove('is-flicker-in');
        swiperEl.classList.remove('is-flicker-out');
      }
    }
  };

  const sliderCandidates = [...products].filter(p => {
    // Hide ready-stock products if they are out of stock
    if (p.isReadyStock && p.stock <= 0) return false;
    
    // Include if it is featured OR ready stock
    return p.isHeroSlider || p.isReadyStock;
  }).sort((a, b) => {
    // Featured products prioritize over ready stock
    if (a.isHeroSlider && !b.isHeroSlider) return -1;
    if (!a.isHeroSlider && b.isHeroSlider) return 1;
    // Fallback to sorting by views
    return (b.views || 0) - (a.views || 0);
  });
  
  const heroSliderItems = sliderCandidates.slice(0, 6);
  
  const headerAnimProps = {
    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  const flashSaleItems = useMemo(() => {
    return products.filter((p: any) => p.saleType === 'FLASH_SALE').slice(0, 5);
  }, [products]);

  const [displayCount, setDisplayCount] = useState(7);
  const [hoveredChar, setHoveredChar] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const updateCols = () => setCols(window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4);
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8);
  };
  const allFeaturedProducts = products.filter(p => p.category !== '3d-printer').sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const featuredProducts = allFeaturedProducts.slice(0, displayCount);
  const hasMore = displayCount < allFeaturedProducts.length;
  const isLoading = false;

  return (
    <div className="home-page pb-20">
      <section className="hero-section" style={{ position: 'relative' }}>
        <style>{`
          
          @keyframes slide-reveal {
            0% { clip-path: polygon(0 0, 100% 0, 100% 0%, 0 0%); }
            100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          }
          @keyframes sci-fi-scan {
            0% { top: 0%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            95% { top: 100%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
            100% { top: 100%; opacity: 0; box-shadow: none; }
          }
          .hero-blog-swiper .swiper-slide {
            background-color: #050505 !important;
          }
          .hero-blog-swiper .swiper-slide-active .hero-slide-content {
            animation: slide-reveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .hero-blog-swiper .swiper-slide-active .scanner-overlay {
            position: absolute;
            left: 0;
            right: 0;
            height: 3px;
            background: #fff;
            z-index: 25;
            pointer-events: none;
            opacity: 0;
            animation: sci-fi-scan 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .hero-pagination {
            display: flex;
            justify-content: center;
            gap: 12px;
          }
          .hero-pagination .swiper-pagination-bullet {
            background: rgba(255,255,255,0.4);
            opacity: 1;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            transition: all 0.3s;
            margin: 0 !important;
          }
          .hero-pagination .swiper-pagination-bullet-active {
            background: var(--color-accent);
            width: 24px;
            border-radius: 4px;
          }
          @media (max-width: 768px) {
            .hero-blog-swiper {
              aspect-ratio: 16/10;
            }
          }
        `}</style>
        <Swiper
          className="hero-blog-swiper"
          modules={[Autoplay, Navigation, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev' }}
          autoplay={{ delay: 15000, disableOnInteraction: false }}
          loop={true}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          style={{ width: '100%', height: '70vh', minHeight: '600px', backgroundColor: 'var(--color-bg)' }}
        >

          {/* Initial Scan Effect */}
          <div className="scanner-overlay"></div>

          {/* Nav & Loading Cluster */}
          

          
          {/* Nav & Loading Cluster (GLOBAL, OUTSIDE SWIPER SLIDE TO PREVENT REF DUPLICATION) */}
          <div className="container" style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
            <div className="global-nav-cluster" style={{ position: 'absolute', bottom: '10%', right: '5%', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="hero-prev tech-box-wrapper hover-jump" style={{ position: 'relative', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', padding: 0, marginTop: 0, left: 'auto', right: 'auto' }}>
                <div className="tech-box" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                  <Icons.ChevronLeft color="var(--color-accent)" size={24} />
                </div>
              </button>
              <button className="hero-next tech-box-wrapper hover-jump" style={{ position: 'relative', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', padding: 0, marginTop: 0, left: 'auto', right: 'auto' }}>
                <div className="tech-box" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                  <Icons.ChevronRight color="var(--color-accent)" size={24} />
                </div>
              </button>
            </div>
            
            <div className="tech-box-wrapper box-tr-loading" style={{ position: 'relative', width: 'auto', left: 'auto', right: 'auto', top: 'auto', bottom: 'auto' }}>
              <div className="tech-box" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
                <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(36, 214, 115, 0.2)" strokeWidth="3" />
                    <circle 
                      ref={progressCircle}
                      cx="16" cy="16" r="14" fill="none" 
                      stroke="var(--color-accent)" strokeWidth="3" 
                      strokeDasharray={2 * Math.PI * 14}
                      strokeDashoffset="0"
                      style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                    />
                  </svg>
                  <span ref={progressText} style={{ position: 'absolute', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-accent)' }}>15s</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>SYS_LOAD</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>INITIALIZING</span>
                </div>
              </div>
            </div>
          </div>
              </div>
            </div>
          </div>
          {heroSliderItems.map((prod) => (
            <SwiperSlide key={prod.id}>
              <div className="scanner-overlay"></div>
              <div className="hero-slide-content" style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
              <Link to={`/product/${prod.id}`} style={{ display: 'block', width: '100%', height: '100%', position: 'relative', textDecoration: 'none' }}>
                <img 
                  src={prod.bannerImages?.[0] || prod.bannerImage || prod.images?.[0] || '/images/slider-banner.jpg'} 
                  alt={prod.name[language as keyof typeof prod.name]} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-bg) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 30%)' }} />
                <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 120px 60px var(--color-bg)', pointerEvents: 'none' }} />
                
                <div className="container" style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                                    
                  <div className="hero-columns-container" style={{ position: 'absolute', bottom: '10%', left: '5%', right: '5%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 20, pointerEvents: 'none' }}>
                    
                    {/* LEFT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', pointerEvents: 'auto' }}>
                      
                      {/* Row 1: Title */}
                      <div className="tech-box-wrapper hud-title" style={{ position: 'relative' }}>
                        <div className="tech-box" style={{ display: 'flex', alignItems: 'center' }}>
                          <h1 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.3, margin: 0, textShadow: 'none' }}>
                            {prod.name[language as keyof typeof prod.name]}
                          </h1>
                          <span style={{ position: 'absolute', bottom: '6px', right: '16px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            TITLE_DATA
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Description */}
                      {prod.description && prod.description[language as keyof typeof prod.description] && prod.description[language as keyof typeof prod.description].trim() !== '' && (
                        <div className="tech-box-wrapper hud-desc" style={{ position: 'relative' }}>
                          <div className="tech-box">
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0, lineHeight: 1.5 }}>
                                {prod.description[language as keyof typeof prod.description]}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end', pointerEvents: 'auto', paddingBottom: '4.5rem' }}>
                      
                      {/* Row 1: Badges */}
                      <div className="tech-box-wrapper hud-badges" style={{ position: 'relative' }}>
                        <div className="tech-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ background: 'var(--color-accent)', color: '#000', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                              {prod.isHeroSlider ? (language === 'vi' ? 'SẢN PHẨM NỔI BẬT' : 'FEATURED PRODUCT') : (language === 'vi' ? 'SẴN HÀNG GIAO NGAY' : 'IN STOCK')}
                            </span>
                            {prod.collection && settings.collections?.find((c: any) => c.name === prod.collection) && (() => {
                              const col = settings.collections!.find((c: any) => c.name === prod.collection); if (!col) return null;
                              const IconComponent = Icons[col.iconName as keyof typeof Icons] as any || Icons.Folder;
                              return (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fff', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>
                                  <IconComponent size={12} />
                                  {col.name}
                                </span>
                              );
                            })()}
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fff', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9, background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>
                              <div style={{ width: '14px', height: '14px', perspective: '100px', display: 'inline-block', flexShrink: 0, marginRight: '2px' }}>
                                <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(-45deg)' }}>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5px', fontWeight: 900, transform: 'translateZ(7px)', color: '#fff', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}>3D</div>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3px', fontWeight: 900, transform: 'rotateY(90deg) translateZ(7px)', background: '#fff', color: '#000', boxSizing: 'border-box' }}>PRT</div>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '1.5px solid #fff', transform: 'rotateX(90deg) translateZ(7px)', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}></div>
                                </div>
                              </div>
                              3D PRINTED
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Price & Buy Button */}
                      <div className="tech-box-wrapper hud-price" style={{ position: 'relative' }}>
                        <div className="tech-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.2rem' }}>DATA-FIELD</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-accent)', textShadow: 'none', lineHeight: 1 }}>
                              {formatPrice(prod.price, prod.discountPercentage).current}
                            </span>
                          </div>
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              const defaultSize = prod.availableSizes?.[0] || 'Size 400%';
                              const defaultMaterial = prod.availableMaterials?.[0] || 'PLA';
                              addToCart(prod, defaultSize, defaultMaterial as any, 1, e);
                              showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');
                            }}
                            style={{ 
                              padding: '1.5px',
                              background: 'transparent',
                              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                              width: '100%',
                              cursor: 'pointer',
                              boxShadow: '0 4px 15px rgba(36, 214, 115, 0.15)',
                              marginTop: '0.5rem'
                            }}
                          >
                            <div style={{
                              background: '#061a0645',
                              border: '1px solid rgba(36, 214, 115, 0.4)',
                              clipPath: 'polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px)',
                              padding: '10px 24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '0.9rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              textShadow: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(36, 214, 115, 0.4)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(11, 25, 18, 0.6)'; }}
                            >
                              {language === 'vi' ? 'XÁC NHẬN MUA' : 'CONFIRM ORDER'}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            GIAO DỊCH AN TOÀN [MÃ {prod.id.slice(0, 5).toUpperCase()}]
                          </div>
                        </div>
                      </div>

                      

                    </div>
                  </div>

                </div>
              </Link>
            </div>
            </SwiperSlide>
          ))}
</Swiper>
      </section>


      {/* Middle Banner replacing Video Shorts Slider */}
      {(settings.middleBannerImage || settings.middleBannerImageMobile) && (
        <section className="container" style={{ paddingTop: '2.5rem', marginBottom: '-2.5rem' }}>
          <style>{`
            .blink-cursor {
              animation: blink 1s step-end infinite;
              color: var(--color-accent);
            }
            @keyframes blink { 50% { opacity: 0; } }
            
            .showcase-hitbox:hover .tech-tooltip-wrapper {
              opacity: 1;
              transform: translate(-50%, -10px);
            }
            .tech-tooltip-wrapper {
              position: absolute;
              bottom: 80%;
              left: 50%;
              transform: translate(-50%, 0);
              width: 250px;
              padding: 2px;
              background: rgba(36, 214, 115, 0.4);
              clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
              opacity: 0;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              pointer-events: none;
              z-index: 20;
            }
            .tech-tooltip-inner {
              background: #061a06f0;
              padding: 12px;
              clip-path: polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px);
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .tech-tooltip-title {
              color: #fff;
              font-size: 0.9rem;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 1px;
              border-bottom: 1px solid rgba(36, 214, 115, 0.3);
              padding-bottom: 4px;
            }
            .tech-tooltip-quote {
              color: var(--color-accent);
              font-size: 0.75rem;
              line-height: 1.4;
              font-family: 'Courier New', Courier, monospace;
              min-height: 40px;
            }
            @media (max-width: 768px) {
              .tech-tooltip-wrapper { display: none !important; }
            }
            }
          `}</style>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            style={{ position: 'relative',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <picture>
              {settings.middleBannerImageMobile && <source media="(max-width: 768px)" srcSet={settings.middleBannerImageMobile} />}
              <img 
                src={settings.middleBannerImage || settings.middleBannerImageMobile} 
                alt="Middle Banner" 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
              />
            </picture>
            
            <div style={{ position: 'absolute', inset: '15% 10% 15% 10%', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', zIndex: 10 }}>
              {showcaseCharacters.map((char, idx) => (
                <div 
                  key={idx} 
                  className="showcase-hitbox" 
                  style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredChar(idx)}
                  onMouseLeave={() => setHoveredChar(null)}
                >
                  <div className="tech-tooltip-wrapper">
                    <div className="tech-tooltip-inner">
                      <div className="tech-tooltip-title">{char.name}</div>
                      <div className="tech-tooltip-quote">
                        <TypewriterText text={char.quote} isActive={hoveredChar === idx} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, transparent 15%, transparent 85%, rgba(10,10,10,0.9) 100%)', pointerEvents: 'none' }} />
          </motion.div>
        </section>
      )}

      {/* Categories Grid */}
      <motion.section
        className="container"
        style={{ paddingTop: '5rem' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="cat-collections-row">

          {/* LEFT: Khám phá danh mục */}
          <div className="cat-collections-left" style={{ display: 'flex', flexDirection: 'column' }}>
            <motion.h2 {...headerAnimProps} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="lightning-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.5rem', borderRadius: '8px', position: 'relative', marginLeft: '-1.5rem' }}>
              <Zap size={32} color="var(--color-accent)" className="flash-shake" />
              <span className="lightning-text">FLASH SALE</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="flash-prev hover-jump" style={{ position: 'relative', background: 'rgba(255,255,255,0.15)', padding: '1px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                  <div style={{ width: '100%', height: '100%', background: '#0e100e', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)' }}>
                    <Icons.ChevronLeft size={20} color="#8892b0" />
                  </div>
                </button>
                <button className="flash-next hover-jump" style={{ position: 'relative', background: 'rgba(255,255,255,0.15)', padding: '1px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                  <div style={{ width: '100%', height: '100%', background: '#0e100e', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)' }}>
                    <Icons.ChevronRight size={20} color="#8892b0" />
                  </div>
                </button>
              </div>
            </motion.h2>
            
            <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {flashSaleItems.length > 0 ? (
                <Swiper
                  modules={[Pagination, Autoplay, Navigation]}
                  spaceBetween={20}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  navigation={{ nextEl: '.flash-next', prevEl: '.flash-prev' }}
                  style={{ width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '150px' }}
                  className="flash-sale-swiper"
                >
                  {flashSaleItems.map((product: any) => (
                    <SwiperSlide key={product.id}>
                      <Link to={`/product/${product.id}`} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', background: 'rgba(0,0,0,0.5)', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                          <img 
                            src={product.bannerImages?.[0] || product.bannerImage || product.images?.[0]} 
                            alt={product.name[language as keyof typeof product.name]}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', transform: 'scale(0.8)', transformOrigin: 'top right' }}>
                            {/* Collection Badge */}
                            {product.collection && settings.collections?.find((c: any) => c.name === product.collection) && (() => {
                              const col = settings.collections!.find((c: any) => c.name === product.collection); if (!col) return null;
                              const IconComponent = (Icons as any)[col.iconName] || Icons.Folder;
                              return (
                                <div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: col.bg || 'rgba(255,255,255,0.1)', border: `1px solid ${col.border || 'rgba(255,255,255,0.2)'}`, color: col.color || '#fff', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', textTransform: 'uppercase', pointerEvents: 'auto', textAlign: 'center' }}>
                                  <IconComponent size={24} />
                                  <span style={{ lineHeight: 1.1 }}>{col.name}</span>
                                </div>
                              );
                            })()}

                            {/* Category Badge */}
                            {product.category && (
                              <div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                                <Icons.Layers size={24} />
                                <span style={{ lineHeight: 1.1 }}>{product.category.toUpperCase()}</span>
                              </div>
                            )}
                            
                            {/* 3D Printed Badge */}
                            <div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                              <div style={{ width: '28px', height: '28px', perspective: '200px', display: 'inline-block', flexShrink: 0 }}>
                                <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(-45deg)' }}>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, transform: 'translateZ(14px)', color: '#fff', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}>3D</div>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 900, transform: 'rotateY(90deg) translateZ(14px)', background: '#fff', color: '#000', boxSizing: 'border-box' }}>PRT</div>
                                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fff', transform: 'rotateX(90deg) translateZ(14px)', boxSizing: 'border-box', background: 'rgba(0,0,0,0.4)' }}></div>
                                </div>
                              </div>
                              <span style={{ lineHeight: 1.1 }}>3D PRINT</span>
                            </div>
                            
                            {/* Size Badge */}
                            {product.availableSizes?.[0] && (() => {
                              const details = getSizeDetails(product.availableSizes[0]);
                              return (
                                <div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: '75px', height: '75px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                                  <Icons.Maximize size={22} style={{ marginBottom: '2px' }} />
                                  <span style={{ lineHeight: 1.1 }}>{details.label}</span>
                                  {details.height && <span style={{ fontSize: '0.45rem', opacity: 0.7, lineHeight: 1 }}>({details.height})</span>}
                                </div>
                              );
                            })()}
                          </div>
                          <div style={{
                            position: 'absolute', top: '10px', left: '10px',
                            background: 'linear-gradient(45deg, #ef4444, #f97316)', color: 'white',
                            borderRadius: '20px', fontWeight: 'bold', padding: '4px 10px', fontSize: '0.8rem',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            boxShadow: '0 0 15px rgba(239,68,68,0.5)', zIndex: 2
                          }}>
                            <Zap size={14} fill="currentColor" />
                            -{product.discountPercentage}%
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', minHeight: '200px' }}>
                  <p style={{ color: 'var(--color-text-muted)' }}>Đang cập nhật Flash Sale</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Bộ sưu tập */}
          <div className="cat-collections-right">
            <motion.h2 {...headerAnimProps} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <LegoHeadIcon size={32} />
                {language === 'vi' ? 'Bộ Sưu Tập' : 'Collections'}
              </span>
              {/* Scroll arrows - only visible on mobile via CSS */}
              <span className="collections-nav" style={{ gap: '0.35rem', flexShrink: 0 }}>
                <button
                  onClick={() => {
                    const el = document.querySelector('.collections-grid') as HTMLElement;
                    if (el) el.scrollBy({ left: -200, behavior: 'smooth' });
                  }}
                  className="chamfer-btn"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', cursor: 'pointer', flexShrink: 0 }}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => {
                    const el = document.querySelector('.collections-grid') as HTMLElement;
                    if (el) el.scrollBy({ left: 200, behavior: 'smooth' });
                  }}
                  className="chamfer-btn"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', color: 'var(--color-text-muted)', cursor: 'pointer', flexShrink: 0 }}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </span>
            </motion.h2>
            <div className="collections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.5rem' }}>
              {((settings.collections && settings.collections.length > 0) ? settings.collections : []).map((col, i) => {
                const IconComponent = (Icons as any)[col.iconName] || Icons.HelpCircle;
                return (
                <Link to={col.path} key={i} style={{ textDecoration: 'none' }}>
                  <motion.div
                      className="col-card"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-20px' }}
                      whileHover={{
                        scale: 1.06,
                        boxShadow: `0 0 16px ${col.color}50`,
                        borderColor: col.color,
                        transition: { duration: 0.2 }
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 300, 
                        damping: 18, 
                        delay: i * 0.06 
                      }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.9rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: col.bg,
                      border: `1px solid ${col.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {col.image ? <img src={col.image} alt={col.name} style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> : <span style={{ fontSize: '1.6rem', lineHeight: 1, display: 'flex', justifyContent: 'center' }}><IconComponent size={24} /></span>}
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      color: col.color,
                      textAlign: 'center',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                    }}>{col.name}</span>
                </motion.div>
              </Link>
            );
          })}
            </div>
          </div>

        </div>
      </motion.section>

      {/* Featured Products Grid */}
      <section className="container" style={{ paddingTop: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'nowrap', gap: '0.5rem' }}>
          <motion.h2 {...headerAnimProps} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <LegoHeadIcon size={32} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('featured_drops')}</span>
          </motion.h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--glass-border)' }} className="view-toggle-mobile">
              <button onClick={() => setViewMode('grid')} title="Grid"
                style={{ padding: '0.4rem 0.5rem', background: viewMode === 'grid' ? 'var(--color-accent)' : 'transparent', color: viewMode === 'grid' ? '#000' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} title="List"
                style={{ padding: '0.4rem 0.5rem', background: viewMode === 'list' ? 'var(--color-accent)' : 'transparent', color: viewMode === 'list' ? '#000' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                <LayoutList size={16} />
              </button>
            </div>
            <Link to="/products" title={t('view_all')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent)', color: '#000', padding: '0.4rem 0.5rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) var(--radius-sm)', clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px, 3px 6px, 3px 3px, 6px 3px)', transition: 'all 0.2s' }}>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Product grid with interspersed single-column ad banners */}
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredProducts.length}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={viewMode === 'list' ? 'product-list' : 'product-grid'}
            style={{ position: 'relative' }}
          >
            {featuredProducts.map((product: typeof featuredProducts[0], idx: number) => {
              const showAd1 = idx === (cols - 1) && viewMode === 'grid';

              return (
                <React.Fragment key={product.id}>
                  <ProductCard product={product} idx={idx} listMode={viewMode === 'list'} />
                
                {showAd1 && (
                  <div className="product-card" style={{
                    background: 'linear-gradient(135deg, #0a1c0a 0%, #1a3a1a 100%)',
                    border: '1px solid rgba(74,222,128,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '2rem',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(74,222,128,0.1)',
                    height: '100%'
                  }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(74,222,128,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
                    <Zap size={48} color="var(--color-accent)" style={{ marginBottom: '1.5rem' }} className="flash-shake" />
                    <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}><Zap size={14} style={{display:'inline-block', verticalAlign:'middle', marginRight:'4px'}}/> Flash Deal</p>
                    <h3 className="ad-title" style={{ fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem', color: '#fff' }}>
                      {language === 'vi' ? 'Giảm 40%' : '40% OFF'}<br/>Marvel Sets
                    </h3>
                    <Link to="/category/superheroes?q=marvel" style={{ textDecoration: 'none', width: '100%', marginTop: 'auto' }}>
                      <motion.button whileHover={{ scale: 1.05 }} style={{ width: '100%', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.8rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                        {language === 'vi' ? 'Mua Ngay' : 'Shop Now'}
                      </motion.button>
                    </Link>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          </motion.div>
        </AnimatePresence>

        <div style={{ marginTop: '3rem', width: '100%', position: 'relative' }}>
          <button
            onClick={hasMore ? handleLoadMore : undefined}
            disabled={isLoading || !hasMore}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem 1.5rem',
              borderRadius: '8px', cursor: (isLoading || !hasMore) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || !hasMore) ? 0.7 : 1, transition: 'all 0.3s ease',
              position: 'relative', overflow: 'hidden'
            }}
            onMouseEnter={(e) => { if (hasMore && !isLoading) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={(e) => { if (hasMore && !isLoading) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            {/* Progress Background */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(Math.min(featuredProducts.length, allFeaturedProducts.length) / allFeaturedProducts.length) * 100}%`, background: 'rgba(36, 214, 115, 0.15)', zIndex: 0, transition: 'width 0.5s ease' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1, color: '#fff', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase' }}>
              {isLoading ? <Icons.Loader2 size={20} className="animate-spin" color="var(--color-accent)" /> : <Icons.ChevronRight size={20} color="var(--color-accent)" />}
              {isLoading ? (language === 'vi' ? 'Đang tải...' : 'Loading...') : (hasMore ? (language === 'vi' ? 'XEM THÊM SẢN PHẨM' : 'LOAD MORE PRODUCTS') : (language === 'vi' ? 'ĐÃ HIỂN THỊ HẾT' : 'NO MORE PRODUCTS'))}
            </div>

            <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                {language === 'vi' ? `Hiển thị ${featuredProducts.length} / ${allFeaturedProducts.length}` : `Showing ${featuredProducts.length} / ${allFeaturedProducts.length}`}
              </div>
              <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(Math.min(featuredProducts.length, allFeaturedProducts.length) / allFeaturedProducts.length) * 100}%`, height: '100%', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          </button>
        </div>
      </section>


      {/* Blog Section */}
      <motion.section 
        className="container" 
        style={{ paddingTop: '5rem' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'nowrap', gap: '0.5rem' }}>
          <motion.h2 {...headerAnimProps} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <LegoHeadIcon size={32} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('latest_news')}</span>
          </motion.h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <Link to="/news" title={language === 'vi' ? 'Xem Tất Cả' : 'View All'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent)', color: '#000', padding: '0.4rem 0.5rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) var(--radius-sm)', clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px, 3px 6px, 3px 3px, 6px 3px)', transition: 'all 0.2s' }}>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <Swiper
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
          style={{ paddingBottom: '2.5rem' }}
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
        </Swiper>
      </motion.section>

      <style>{`
        .product-card {
          transform: translateY(0);
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(74, 222, 128, 0.15);
        }
        .hover-cart-btn:hover {
          background: var(--color-accent) !important;
          color: #000 !important;
          transform: scale(1.1);
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-3px) rotate(-3deg); }
          50% { transform: translateX(3px) rotate(3deg); }
          75% { transform: translateX(-3px) rotate(-3deg); }
          100% { transform: translateX(0); }
        }
        .flash-shake {
          animation: shake 0.6s ease-in-out infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .category-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(3, 1fr);
        }
        .category-card {
          height: 300px;
        }
        .blog-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }
        

        .product-card { padding: 0; gap: 0; }
        .product-title { font-size: 1.25rem; line-height: 1.3; }
        .product-price { font-size: 1.25rem; }
        .product-price-old { font-size: 0.875rem; }
        .sale-badge { padding: 0.25rem 0.75rem; font-size: 0.75rem; }
        .product-footer-badge { padding: 4px 10px; font-size: 0.875rem; }
        .why-panel { padding: 4rem; }
        .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; }
        .why-title { font-size: 2.5rem; }

        @media (max-width: 1023px) {
          .category-card {
            height: 250px;
          }
          .blog-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
          
        }

        @media (max-width: 639px) {
          .category-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            margin: 0 -1rem;
            padding: 0 1rem 1rem 1rem;
            gap: 1rem;
          }
          .category-grid::-webkit-scrollbar { display: none; }
          .category-card {
            min-width: 260px;
            height: 180px;
            scroll-snap-align: center;
          }
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          
          
          
          
          /* Compact mobile product cards */
          .product-card { padding: 0; gap: 0; border-radius: var(--radius-md); overflow: hidden; }
          .product-header { flex-direction: column !important; gap: 0.25rem; }
          .product-price-container { flex-direction: row-reverse !important; align-items: baseline !important; justify-content: flex-end !important; gap: 0.5rem; width: 100%; }
          .product-title { font-size: 0.95rem; padding-right: 0 !important; }
          .product-price { font-size: 1.1rem; }
          .product-price-old { font-size: 0.8rem; margin-bottom: 0 !important; }
          .sale-badge { padding: 0.15rem 0.5rem; font-size: 0.65rem; }
          .product-footer-badge { padding: 2px 6px; font-size: 0.75rem; gap: 4px; }
          
          /* Why panel compact */
          .why-panel { padding: 2rem 1.5rem; }
          .why-grid { grid-template-columns: 1fr; gap: 2rem; }
          .why-title { font-size: 1.75rem; margin-bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

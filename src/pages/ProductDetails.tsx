import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronDown, ChevronUp, Star, Clock, Heart, ArrowLeft, Truck, Zap, ClipboardCheck, Hammer, Play, LayoutGrid, LayoutList, Rocket, ChevronLeft, ChevronRight, Home, Eye, Maximize, X, Gift, Plus, Minus, Info, Weight, Image as ImageIcon, Video, XCircle, Wrench, Package, Shield, Crosshair, HelpCircle, User } from 'lucide-react';
import { mockProducts, type ProductSize } from '../data/mockProducts';
import { useStore, type ProductMaterial } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { LegoHeadIcon } from '../components/LegoHeadIcon';

const getSizeDetails = (sizeStr: string) => {
  if (sizeStr.includes('300')) return { label: '300%', height: '21 cm', scale: 0.6 };
  if (sizeStr.includes('400')) return { label: '400%', height: '28 cm', scale: 0.8 };
  if (sizeStr.includes('1000')) return { label: '1000%', height: '70 cm', scale: 1.2 };
  return { label: sizeStr, height: '', scale: 0.8 };
};

const parseSizePercentage = (sizeStr: string | null) => {
  if (!sizeStr) return 1;
  const num = parseInt(sizeStr.replace('Size ', ''), 10);
  return isNaN(num) ? 1 : num / 400;
};

const LegoSilhouette = ({ scale = 1, color = 'var(--color-text-muted)' }) => (
  <svg 
    viewBox="0 0 100 150" 
    style={{ 
      width: `${scale * 50}px`, 
      height: `${scale * 75}px`, 
      transition: 'all 0.3s' 
    }} 
    fill={color}
  >
    <rect x="38" y="5" width="24" height="10" rx="3" />
    <rect x="28" y="15" width="44" height="38" rx="8" />
    <path d="M 30 55 L 70 55 L 82 100 L 18 100 Z" />
    <path d="M 28 58 L 12 85 L 22 90 L 32 75 Z" />
    <path d="M 72 58 L 88 85 L 78 90 L 68 75 Z" />
    <circle cx="17" cy="88" r="7" />
    <circle cx="83" cy="88" r="7" />
    <rect x="23" y="102" width="24" height="43" rx="3" />
    <rect x="53" y="102" width="24" height="43" rx="3" />
  </svg>
);

const FilamentSpool = ({ color, isActive }: { color: string, isActive: boolean }) => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem', transition: 'all 0.3s', filter: isActive ? `drop-shadow(0 0 10px ${color})` : 'none', opacity: isActive ? 1 : 0.5 }}>
    <ellipse cx="12" cy="5" rx="7" ry="2" fill="var(--color-surface)" />
    <ellipse cx="12" cy="19" rx="7" ry="2" fill="var(--color-surface)" />
    <path d="M6.5 5v14 M17.5 5v14" />
    <rect x="6.5" y="5" width="11" height="14" fill={color} opacity="0.2" stroke="none" />
    <path d="M6.5 8h11 M6.5 11h11 M6.5 14h11 M6.5 17h11" strokeOpacity="0.4" />
    <ellipse cx="12" cy="5" rx="2" ry="0.8" fill="var(--color-bg)" />
  </svg>
);

const AnimatedPrice = ({ priceString }: { priceString: string }) => {
  return (
    <span style={{ display: 'inline-flex' }}>
      {priceString.split('').map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};




const blockGlitch = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0, 1, 0.5, 1],
    x: [-15, 15, -10, 10, -5, 0],
    skewX: [30, -30, 15, -15, 5, 0],
    filter: ['hue-rotate(90deg)', 'hue-rotate(-90deg)', 'hue-rotate(45deg)', 'hue-rotate(-45deg)', 'hue-rotate(0deg)', 'hue-rotate(0deg)'],
    transition: { duration: 0.4, ease: 'linear' }
  }
};

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();
  const { products, updateProduct, addToCart, saveCharacter, unsaveCharacter, t, language, formatPrice, showToast, settings, user, reviews, addReview, getSizeMultiplier, getSizeDetails: getStoreSizeDetails } = useStore();
  
  const relatedRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth;
      ref.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  let product = products.find(p => p.id === id) || mockProducts.find(p => p.id === id);
  
  // Randomly select a banner image if multiple exist
  const selectedBanner = useMemo(() => {
    if (!product) return null;
    const allBanners = product.bannerImages && product.bannerImages.length > 0 
      ? product.bannerImages 
      : (product.bannerImage ? [product.bannerImage] : []);
    if (allBanners.length === 0) return null;
    return allBanners[Math.floor(Math.random() * allBanners.length)];
  }, [product?.id, product?.bannerImages, product?.bannerImage]);
  
  // Create padded images for display only
  const defaultLogo = settings?.logoImage || '/images/fallback-logo.jpg';
  let displayImages = product?.images && product.images.length > 0 ? [...product.images] : [];
  
  if (product && displayImages.length === 0) {
    const mockP = mockProducts.find(p => p.id === id);
    displayImages = mockP?.images?.length ? [mockP.images[0]] : [defaultLogo];
  }
  
  while (displayImages.length < 10) {
    displayImages.push(defaultLogo);
  }
  
  const [isLiked, setIsLiked] = useState(() => !!localStorage.getItem('liked_' + id));

  useEffect(() => {
    if (product && product.isReadyStock) {
      if (product.availableMaterials && product.availableMaterials.length > 0) {
        // If ready stock and specific materials are set, default to first available
        if (product.availableMaterials.includes('PETG')) setSelectedMaterial('PETG');
        else setSelectedMaterial('PLA');
      }
      if (product.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[0]);
      }
    } else if (product && product.availableSizes && !selectedSize) {
      setSelectedSize(product.availableSizes[0]);
    }
  }, [product?.id]);

  useEffect(() => {
    if (product && !sessionStorage.getItem('viewed_' + id)) {
      sessionStorage.setItem('viewed_' + id, 'true');
      const currentViews = typeof product.views === 'number' ? product.views : 0;
      updateProduct({ ...product, views: currentViews + 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLike = (e?: React.MouseEvent) => {
    if (!product) return;
    if (isLiked) {
      setIsLiked(false);
      localStorage.removeItem('liked_' + product.id);
      updateProduct({ ...product, likes: Math.max(0, (product.likes || 0) - 1) });
    } else {
      setIsLiked(true);
      if (e && e.clientX) {
        window.dispatchEvent(new CustomEvent('star-burst', { detail: { x: e.clientX, y: e.clientY } }));
      }
      localStorage.setItem('liked_' + product.id, 'true');
      updateProduct({ ...product, likes: (product.likes || 0) + 1 });
      showToast(language === 'vi' ? 'Đã yêu thích sản phẩm!' : 'Added to wishlist!');
    }
  };
  const [viewModeRelated, setViewModeRelated] = useState<'grid' | 'list'>('grid');
  const [viewModeBestSellers, setViewModeBestSellers] = useState<'grid' | 'list'>('grid');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  const prevImage = () => {
    setSlideDirection(-1);
    setActiveImageIndex(prev => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };
  
  const nextImage = () => {
    setSlideDirection(1);
    setActiveImageIndex(prev => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(product?.availableSizes[0] || null);
  const [selectedMaterial, setSelectedMaterial] = useState<ProductMaterial>('PLA');
  const [isFastCrafting, setIsFastCrafting] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [isEngravingSelected, setIsEngravingSelected] = useState(false);
  const [isEngravingInputVisible, setIsEngravingInputVisible] = useState(false);
  const [isSelfAssembly, setIsSelfAssembly] = useState(false);
  const [selectedMicaBox, setSelectedMicaBox] = useState('');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'tags' | 'bio'>('desc');
  const [isCartExpanded, setIsCartExpanded] = useState(window.innerWidth >= 1024);
  const [quantity, setQuantity] = useState(1);
  const [wantsToCraft, setWantsToCraft] = useState(false);
  const isEffectivelyCrafting = !product?.isReadyStock || wantsToCraft;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewVideo, setReviewVideo] = useState<string | undefined>(undefined);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const reviewBoxRef = useRef<HTMLDivElement>(null);
  const [prevScrollY, setPrevScrollY] = useState(0);

  const handleOpenReview = () => {
    setPrevScrollY(window.scrollY);
    setIsReviewOverlayOpen(true);
    setTimeout(() => {
      if (reviewBoxRef.current) {
        reviewBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCloseReview = () => {
    setIsReviewOverlayOpen(false);
    setTimeout(() => {
      window.scrollTo({ top: prevScrollY, behavior: 'smooth' });
    }, 50);
  };

  // Auto-switch to specs tab if no description
  useEffect(() => {
    if (product && !product.description?.[language] && !product.biography?.[language as keyof typeof product.biography]) {
      setActiveTab(product?.biography?.[language as keyof typeof product.biography] ? 'bio' : 'specs');
    }
  }, [product?.id, language]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsCartExpanded(true);
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getQuantityDiscount = (qty: number) => {
    if (qty >= 10) return 0.15;
    if (qty >= 6) return 0.10;
    if (qty >= 3) return 0.05;
    return 0;
  };
  const qtyDiscount = getQuantityDiscount(quantity);

  const baseUnitCost = product ? product.price * getSizeMultiplier(selectedSize) * (selectedMaterial === 'PETG' ? 1.2 : 1) * (isFastCrafting ? 1.1 : 1) : 0;
  const boxUnitCost = selectedMicaBox === 'standard' ? 150000 / 25400 : selectedMicaBox === 'led' ? 250000 / 25400 : 0;
  const totalPriceUSD = (baseUnitCost + boxUnitCost) * quantity * (1 - qtyDiscount);

  const currentPriceString = product 
    ? formatPrice(totalPriceUSD, product.discountPercentage).current 
    : '';

  if (!product) {
    return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>Product not found</div>;
  }

  const productReviews = reviews ? reviews.filter(r => r.productId === product.id && r.status === 'APPROVED') : [];
  const averageRating = productReviews.length > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1) : '5.0';

  const handleReviewMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploadingMedia(true);
    try {
      if (type === 'video') {
        const file = files[0];
        if (file.size > 50 * 1024 * 1024) {
          showToast(language === 'vi' ? 'Video phải nhỏ hơn 50MB' : 'Video must be under 50MB');
          setIsUploadingMedia(false);
          return;
        }
        const res = await fetch('/api/get-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type })
        });
        const { signedUrl, publicUrl } = await res.json();
        await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
        setReviewVideo(publicUrl);
      } else {
        const urls = [...reviewImages];
        for (let i = 0; i < files.length; i++) {
          if (urls.length >= 4) {
            showToast(language === 'vi' ? 'Chỉ được tải tối đa 4 ảnh' : 'Max 4 images allowed');
            break;
          }
          const file = files[i];
          if (file.size > 5 * 1024 * 1024) {
             showToast(language === 'vi' ? 'Ảnh ' + file.name + ' lớn hơn 5MB' : 'Image ' + file.name + ' over 5MB');
             continue;
          }
          const res = await fetch('/api/get-upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, contentType: file.type })
          });
          const { signedUrl, publicUrl } = await res.json();
          await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
          urls.push(publicUrl);
        }
        setReviewImages(urls);
      }
    } catch (error) {
      console.error(error);
      showToast(language === 'vi' ? 'Lỗi khi tải file' : 'Error uploading file');
    }
    
    setIsUploadingMedia(false);
    if (e.target) e.target.value = '';
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    setIsSubmittingReview(true);
    if (addReview) {
      await addReview({
        productId: product.id,
        userId: user?.uid || '',
        userName: user?.displayName || 'Ẩn danh',
        userAvatar: user?.photoURL || undefined,
        rating: reviewRating,
        content: reviewContent,
        images: reviewImages.length > 0 ? reviewImages : undefined,
        video: reviewVideo
      });
    }
    setReviewContent('');
    setReviewRating(5);
    setReviewImages([]);
    setReviewVideo(undefined);
    setIsSubmittingReview(false);
  };


  const handleAddToCart = (e?: React.MouseEvent) => {
    if (product && selectedSize) {
      addToCart(product, selectedSize, selectedMaterial, quantity, e, isFastCrafting, engravingText, selectedMicaBox, isSelfAssembly);
      showToast(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');
    }
  };

  // Determine crafting time based on size for the progress UI
  let minDays = isFastCrafting ? 1 : 2;
  let maxDays = isFastCrafting ? 2 : 4;
  if (selectedSize === 'Size 1000') {
    minDays = isFastCrafting ? 2 : 5;
    maxDays = isFastCrafting ? 4 : 7;
  }
  minDays += (quantity - 1);
  maxDays += (quantity - 1);
  let craftTimeDays = `${minDays}-${maxDays}`;

  return (
    <div className="container" style={{ paddingTop: '120px' }}>
      {selectedBanner ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`product-detail-banner ${isInitialLoad ? 'is-initial-load' : ''}`} style={{ backgroundColor: '#050505', position: 'relative', overflow: 'hidden' }}>
          <style>{`
            @keyframes pd-slide-reveal {
              0% { clip-path: polygon(0 0, 100% 0, 100% 0%, 0 0%); }
              100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
            }
            @keyframes pd-sci-fi-scan {
              0% { top: 0%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
              95% { top: 100%; opacity: 1; box-shadow: 0 0 20px 5px var(--color-accent); }
              100% { top: 100%; opacity: 0; box-shadow: none; }
            }
            .pd-slide-content {
              animation: pd-slide-reveal 1.0s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            .pd-scanner-overlay {
              position: absolute;
              left: 0;
              right: 0;
              height: 3px;
              background: #fff;
              z-index: 25;
              pointer-events: none;
              opacity: 0;
              animation: pd-sci-fi-scan 1.0s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            
            .product-detail-banner.is-initial-load .pd-slide-content,
            .product-detail-banner.is-initial-load .pd-scanner-overlay {
              animation-delay: 2s !important;
              animation-fill-mode: both !important;
            }
            .product-detail-banner.is-initial-load .pd-hud-delayed {
              animation-delay: 3.2s !important;
              animation-fill-mode: both !important;
            }
            .pd-hud-delayed {
              opacity: 0;
              transform: translateY(15px);
              animation: hud-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1) 1.2s forwards;
            }
          `}</style>
          
          <div className="pd-scanner-overlay"></div>
          
          <div className="pd-slide-content" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            <img src={selectedBanner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
            
            {/* Inner dark vignette for breadcrumb visibility */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              boxShadow: 'inset 0 0 150px 40px rgba(0,0,0,0.9)',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)',
              zIndex: 1, pointerEvents: 'none'
            }}></div>
          </div>
          
          {/* Badges Container */}
          <div className="product-detail-badges pd-hud-delayed">
            {/* Collection Badge */}
            {product.collection && settings.collections?.find((c: any) => c.name === product.collection) && (() => {
              const col = settings.collections!.find((c: any) => c.name === product.collection); if (!col) return null;
              const IconComponent = Icons[col.iconName as keyof typeof Icons] as any || Icons.Folder;
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
            {(selectedSize || (!isEffectivelyCrafting && product.dimensions)) && (() => {
              let displaySize = '';
              if (isEffectivelyCrafting && selectedSize) {
                const details = getStoreSizeDetails(selectedSize);
                displaySize = details?.heightCm ? `${details.heightCm}cm` : '';
              } else if (!isEffectivelyCrafting && product.dimensions) {
                displaySize = product.dimensions;
              }
              
              if (!displaySize) return null;
              
              return (
                <div className="hover-jump" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', width: 'auto', minWidth: '75px', height: '75px', padding: '0 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px', backdropFilter: 'blur(12px)', pointerEvents: 'auto', textAlign: 'center' }}>
                  <Icons.Maximize size={22} style={{ marginBottom: '2px' }} />
                  <span style={{ lineHeight: 1.1, whiteSpace: 'nowrap' }}>{displaySize}</span>
                </div>
              );
            })()}
          </div>

          
          
          
          <div className="pd-hud-delayed" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden' }}>
              <span className="hover-text-primary" style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }} onClick={() => navigate('/')}>
                <Home size={14} />
                {language === 'vi' ? 'Trang chủ' : 'Home'}
              </span>
              <ChevronRight size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
              <span className="hover-text-primary" style={{ cursor: 'pointer', transition: 'color 0.2s', flexShrink: 0 }} onClick={() => navigate(`/products/${product.category}`)}>{product.category}</span>
              <ChevronRight size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
              <span style={{ color: 'var(--color-accent)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name[language as keyof typeof product.name]}</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', width: '100%' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)', whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden' }}>
            <span className="hover-text-primary" style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }} onClick={() => navigate('/')}>
              <Home size={14} />
              {language === 'vi' ? 'Trang chủ' : 'Home'}
            </span>
            <ChevronRight size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
            <span className="hover-text-primary" style={{ cursor: 'pointer', transition: 'color 0.2s', flexShrink: 0 }} onClick={() => navigate(`/products/${product.category}`)}>{product.category}</span>
            <ChevronRight size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{product.name[language as keyof typeof product.name]}</span>
          </div>
        </div>
      )}


      <div className="pd-main-grid">
        
        {/* Left: Image Gallery */}
        <div style={{ height: '100%', position: 'relative' }}>
          <motion.div 
            className="pd-image-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              padding: '0', 
              aspectRatio: '1/1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              overflow: 'hidden',
              background: 'transparent',
              position: 'relative',
              border: 'none'
            }}
          >
            {/* Sale Badges */}
            {product.saleType === 'FLASH_SALE' && (
              <div className="flash-shake" style={{
                position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 30,
                background: '#ef4444', color: '#fff', padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.5)'
              }}>
                <Zap size={18} fill="#fff" />
                FLASH SALE -{product.discountPercentage}%
              </div>
            )}
            {product.saleType === 'SALE' && (
              <div style={{
                position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 30,
                background: 'var(--color-accent)', color: '#000', padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)'
              }}>
                SALE -{product.discountPercentage}%
              </div>
            )}

            {isMobile ? (
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Previous Image */}
                <motion.img 
                  src={displayImages[(activeImageIndex - 1 + displayImages.length) % displayImages.length]}
                  style={{ position: 'absolute', left: '-50%', width: '70%', height: '70%', objectFit: 'contain', filter: 'blur(5px)', opacity: 0.4, zIndex: 1, pointerEvents: 'none' }}
                />
                {/* Next Image */}
                <motion.img 
                  src={displayImages[(activeImageIndex + 1) % displayImages.length]}
                  style={{ position: 'absolute', right: '-50%', width: '70%', height: '70%', objectFit: 'contain', filter: 'blur(5px)', opacity: 0.4, zIndex: 1, pointerEvents: 'none' }}
                />
                {/* Active Image */}
                <AnimatePresence mode="popLayout">
                  <motion.img 
                    key={activeImageIndex}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = Math.abs(offset.x) * velocity.x;
                      if (swipe < -100 || offset.x < -100) nextImage();
                      else if (swipe > 100 || offset.x > 100) prevImage();
                    }}
                    initial={{ opacity: 0, scale: 0.8, x: slideDirection * 100 }}
                    animate={{ opacity: 1, scale: 1.1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -slideDirection * 100 }}
                    transition={{ duration: 0.3 }}
                    src={displayImages[activeImageIndex]} 
                    alt={product.name[language as keyof typeof product.name]} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      position: 'absolute',
                      zIndex: 10,
                      cursor: 'grab'
                    }} 
                    whileTap={{ cursor: 'grabbing' }}
                  />
                </AnimatePresence>
                
                {/* Mobile indicators */}
                <div style={{ position: 'absolute', bottom: '1rem', display: 'flex', gap: '6px', zIndex: 20 }}>
                  {displayImages.map((_, idx) => (
                    <div key={idx} style={{ width: idx === activeImageIndex ? '16px' : '6px', height: '6px', borderRadius: '3px', background: idx === activeImageIndex ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  <motion.img 
                    key={activeImageIndex}
                    initial={{ opacity: 0, x: slideDirection * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slideDirection * 40 }}
                    transition={{ duration: 0.3 }}
                    src={displayImages[activeImageIndex] || displayImages[0]} 
                    alt={product.name[language as keyof typeof product.name]} 
                    onClick={() => setIsLightboxOpen(true)}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      position: 'absolute',
                      cursor: 'pointer'
                    }} 
                  />
                </AnimatePresence>

                {/* Horizontal Slider Counter (PC Only) */}
                {displayImages.length > 1 && (
                  <div style={{
                    position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem',
                    zIndex: 30, background: 'rgba(0,0,0,0.4)', padding: '0.5rem 1rem',
                    borderRadius: '100px', border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <button onClick={prevImage} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = '#fff'}>
                      <ChevronLeft size={24} />
                    </button>
                    <div style={{ 
                      fontFamily: 'monospace', fontWeight: 600, fontSize: '1rem', 
                      color: 'var(--color-accent)', letterSpacing: '2px', padding: '0 0.5rem'
                    }}>
                      {(activeImageIndex + 1).toString().padStart(2, '0')} / {displayImages.length.toString().padStart(2, '0')}
                    </div>
                    <button onClick={nextImage} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseLeave={e => e.currentTarget.style.color = '#fff'}>
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
                
                {/* Heart Button */}
                
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const isSaved = user?.savedCharacters?.includes(product.id);
                    if (isSaved) {
                      unsaveCharacter(product.id);
                    } else {
                      saveCharacter(product.id);
                    }
                  }}
                  style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 30,
                    background: user?.savedCharacters?.includes(product.id) ? 'rgba(36, 214, 115, 0.9)' : 'rgba(0,0,0,0.6)', 
                    border: user?.savedCharacters?.includes(product.id) ? '1px solid var(--color-accent)' : '1px solid var(--glass-border)',
                    borderRadius: '20px', padding: '8px 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.2s',
                    boxShadow: user?.savedCharacters?.includes(product.id) ? '0 0 15px rgba(36, 214, 115, 0.5)' : 'none'
                  }}
                  onMouseEnter={e => { if (!user?.savedCharacters?.includes(product.id)) { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; } }}
                  onMouseLeave={e => { if (!user?.savedCharacters?.includes(product.id)) { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; } }}
                >
                  <Gift size={16} color="#fff" />
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{language === 'vi' ? (user?.savedCharacters?.includes(product.id) ? 'Đã lưu' : 'Lưu bộ sưu tập') : (user?.savedCharacters?.includes(product.id) ? 'Saved' : 'Add to Collection')}</span>
                </motion.button>
              </>
            )}
          </motion.div>
          
          {/* Video Section below image */}
          {((product.videos && product.videos.length > 0) || product.video) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginTop: '2rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}
            >
              <div style={{ padding: '0.75rem 1rem', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <Play size={16} color="var(--color-accent)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{language === 'vi' ? 'Video Thực Tế' : 'Product Video'}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#000' }}>
                {/* Render old single video if it exists and not in videos array */}
                {product.video && (!product.videos || !product.videos.includes(product.video)) && (
                  <video 
                    src={product.video} 
                    autoPlay 
                    loop 
                    muted 
                    controls
                    style={{ width: '100%', display: 'block' }}
                  />
                )}
                {/* Render multiple videos */}
                {product.videos?.map((vid, idx) => (
                  <video 
                    key={idx}
                    src={vid} 
                    autoPlay={idx === 0} 
                    loop 
                    muted 
                    controls
                    style={{ width: '100%', display: 'block', borderBottom: idx < (product.videos?.length || 0) - 1 ? '1px solid #333' : 'none' }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Sticky Buy Button – left column */}
          <div className="sticky-cart-wrapper">
            <AnimatePresence mode="wait">
              {isCartExpanded ? (
                <motion.div 
                  key="expanded"
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 150, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                >
                  <div className="animated-cart-box" 
                    style={{ 
                      padding: '0.75rem 1rem', width: '100%', 
                      display: 'flex', flexDirection: 'column', gap: '0.75rem',
                      boxShadow: '0 10px 30px rgba(74, 222, 128, 0.3)',
                      borderRadius: 'var(--radius-lg)',
                      
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Quantity */}
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                          <button onClick={(e) => { e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem 0.75rem', fontWeight: 'bold', fontSize: '1.2rem' }}>-</button>
                          <span style={{ color: '#fff', fontWeight: 'bold', width: '30px', textAlign: 'center' }}>{quantity}</span>
                          <button onClick={(e) => { 
                            e.stopPropagation(); 
                            if (!isEffectivelyCrafting && product.stock && quantity >= product.stock) {
                              showToast(language === 'vi' ? `Chỉ còn ${product.stock} sản phẩm sẵn có!` : `Only ${product.stock} items left in stock!`);
                              return;
                            }
                            setQuantity(q => q + 1); 
                          }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem 0.75rem', fontWeight: 'bold', fontSize: '1.2rem' }}>+</button>
                        </div>
                        
                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {qtyDiscount > 0 && (
                            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                              -{qtyDiscount * 100}%
                            </span>
                          )}
                          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>
                            <AnimatedPrice priceString={currentPriceString} />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.5rem', width: '100%' }}>
                        <button 
                          onClick={handleAddToCart}
                          className="sticky-action-btn bling-btn"
                          style={{ 
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            fontSize: '1rem', fontWeight: 800,
                            background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer',
                            padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <ShoppingBag size={20} />
                          <span>{language === 'vi' ? 'MUA NGAY' : 'BUY NOW'}</span>
                        </button>
                        {product.isReadyStock && !wantsToCraft && (
                          <button
                            onClick={() => setWantsToCraft(true)}
                            title={language === 'vi' ? 'Bạn muốn chế tác?' : 'Craft it?'}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: '#3b82f6', color: '#fff', border: 'none',
                              padding: '0 0.75rem', borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer', transition: 'all 0.2s',
                              fontWeight: 700, fontSize: '0.85rem',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 4px 10px rgba(59,130,246,0.3)'
                            }}
                          >
                            <Hammer size={16} style={{ marginRight: '4px' }} />
                            {language === 'vi' ? 'Bạn muốn chế tác?' : 'Craft it?'}
                          </button>
                        )}
                        {isEffectivelyCrafting && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setIsFastCrafting(!isFastCrafting); }}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: '#ef4444', color: '#fff', border: 'none',
                              padding: '0 0.9rem', borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer', transition: 'all 0.2s',
                              boxShadow: isFastCrafting ? 'inset 0 3px 6px rgba(0,0,0,0.4)' : '0 4px 10px rgba(239,68,68,0.4)',
                              transform: isFastCrafting ? 'scale(0.96)' : 'scale(1)',
                            }}
                            title={language === 'vi' ? 'Tăng tốc chế tác (+10% phí)' : 'Fast Crafting (+10% fee)'}
                          >
                            <Rocket size={20} />
                          </button>
                        )}
                        <button
                          className="hide-on-desktop"
                        onClick={() => setIsCartExpanded(false)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none',
                            padding: '0 0.5rem', borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>
                    </div>                    
                    
                    {/* Summary Note */}
                    <div className="summary-note-container" style={{ width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      {/* Toggle header - only on mobile */}
                      {isMobile && (
                        <button
                          onClick={() => setIsSummaryOpen(prev => !prev)}
                          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(0,0,0,0.85)' }}
                        >
                          <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{language === 'vi' ? '📋 Thông tin lựa chọn' : '📋 Selected options'}</span>
                          <span style={{ fontSize: '1rem', transition: 'transform 0.25s', display: 'inline-block', transform: isSummaryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                        </button>
                      )}
                      
                      {/* Collapsible body */}
                      {(!isMobile || isSummaryOpen) && (
                        <div className="summary-note" style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.8)', lineHeight: 1.5, padding: isMobile ? '0 1rem 0.75rem' : '0.75rem 1rem' }}>
                          <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li><strong>{language === 'vi' ? product.name.vi : product.name.en}</strong></li>
                            <li>{language === 'vi' ? 'Size: ' : 'Size: '}<strong>{selectedSize}</strong>, {language === 'vi' ? 'Chất liệu: ' : 'Material: '}<strong>{selectedMaterial}</strong></li>
                            {selectedMicaBox && (
                              <li>{language === 'vi' ? 'Hộp Mica Bảo Vệ: ' : 'Protective Mica Box: '}<strong>{selectedMicaBox === 'standard' ? (language === 'vi' ? 'Thường' : 'Standard') : 'LED'}</strong></li>
                            )}
                            {isEngravingSelected && (
                              <li>{language === 'vi' ? 'Khắc tên: ' : 'Engraving: '}<strong>{engravingText || (language === 'vi' ? '(Có)' : '(Yes)')}</strong></li>
                            )}
                            {isSelfAssembly && (
                              <li><strong>{language === 'vi' ? 'Tự lắp ráp (Nhận chi tiết rời)' : 'Self-assembly (Separated parts)'}</strong></li>
                            )}
                            {!isEffectivelyCrafting ? (
                              <li>{language === 'vi' ? 'Giao hàng: ' : 'Delivery: '}<strong>{language === 'vi' ? 'Trong 1-2 ngày' : '1-2 days'}</strong></li>
                            ) : (
                              <li>
                                {language === 'vi' ? 'Đặt chế tác: ' : 'Pre-order: '}<strong>{craftTimeDays} {language === 'vi' ? 'ngày' : 'days'}</strong>
                                {isFastCrafting ? <span style={{ color: '#b91c1c', marginLeft: '6px', fontWeight: 'bold' }}>({language === 'vi' ? 'Đã bật tăng tốc 🚀' : 'Fast mode ON 🚀'})</span> : <span style={{ color: 'rgba(0,0,0,0.5)', marginLeft: '6px', fontSize: '0.8rem' }}>({language === 'vi' ? 'Nhấn 🚀 để rút ngắn' : 'Tap 🚀 to speed up'})</span>}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="collapsed"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCartExpanded(true)}
                  className="bling-btn"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    color: '#000',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(74, 222, 128, 0.4)',
                    cursor: 'pointer',
                    zIndex: 50
                  }}
                  title={language === 'vi' ? "Mở rộng" : "Expand"}
                >
                  <ShoppingBag size={24} />
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronUp size={16} />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0, width: '100%' }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {product.alignment && (
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.8rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px',
                    marginRight: '12px', verticalAlign: 'middle',
                    background: product.alignment === 'Hero' ? 'rgba(59, 130, 246, 0.15)' : (product.alignment === 'Villain' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 162, 158, 0.15)'),
                    color: product.alignment === 'Hero' ? '#3b82f6' : (product.alignment === 'Villain' ? '#ef4444' : '#a8a29e'),
                    border: `1px solid ${product.alignment === 'Hero' ? 'rgba(59,130,246,0.3)' : (product.alignment === 'Villain' ? 'rgba(239,68,68,0.3)' : 'rgba(168,162,158,0.3)')}`
                  }}>
                    {product.alignment === 'Hero' ? <Shield size={14} /> : (product.alignment === 'Villain' ? <Crosshair size={14} /> : <HelpCircle size={14} />)}
                    {product.alignment.toUpperCase()}
                  </span>
                )}
                {product.name[language]}
              </h1>
              
              <button 
                onClick={handleOpenReview}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                  padding: '0.25rem 0.5rem', background: 'transparent',
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', color: '#fbbf24', fontSize: '1rem', letterSpacing: '1px' }}>★★★★★</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{productReviews.length} Review</span>
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-muted)', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>
                
                <Star size={18} fill="currentColor" />
                <span style={{ color: 'var(--color-text)' }}>{(product.likes || 0) * 2} Fan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Eye size={18} />
                <span>{(product.views || 0) * 2} {language === 'vi' ? 'lượt xem' : 'views'}</span>
              </div>
              {product.isReadyStock ? (
                <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}><Package size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {product.stock} {language === 'vi' ? 'sẵn hàng' : 'in stock'}</span>
              ) : (
                <span style={{ color: '#f59e0b', fontWeight: 600 }}><Wrench size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {language === 'vi' ? 'Đặt chế tác' : 'Made to order'}</span>
              )}
              {product.weight && (
                <span style={{ 
                  display: 'inline-flex', alignItems: 'center', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Weight size={16} style={{marginRight: '8px'}}/> {product.weight}
                </span>
              )}
              {product.sku && (
                <span style={{ 
                  display: 'inline-flex', alignItems: 'center', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, color: formatPrice(totalPriceUSD, product.discountPercentage).isOnSale ? '#ef4444' : 'var(--color-accent)' }}>
                <AnimatedPrice priceString={formatPrice(totalPriceUSD, product.discountPercentage).current} />
              </div>
              {formatPrice(totalPriceUSD, product.discountPercentage).isOnSale && (
                <div style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(totalPriceUSD, product.discountPercentage).original}
                </div>
              )}
            </div>
          </div>

          <div className="material-size-wrapper" ref={reviewBoxRef} style={{ position: 'relative' }}>
            <AnimatePresence>
              {isReviewOverlayOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCloseReview}
                    style={{
                      position: 'fixed', inset: 0, zIndex: 40,
                      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)'
                    }}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
                      background: 'var(--color-bg)', 
                      borderRadius: 'var(--radius-md)', border: '1px solid var(--color-accent)',
                      padding: '1.5rem', display: 'flex', flexDirection: 'column',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, color: 'var(--color-accent)' }}>{language === 'vi' ? 'Đánh giá sản phẩm' : 'Product Reviews'}</h3>
                      <button onClick={handleCloseReview} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {productReviews.length === 0 ? (
                          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Chưa có đánh giá nào.' : 'No reviews yet.'}</p>
                        ) : (
                          productReviews.slice((reviewPage - 1) * 3, reviewPage * 3).map((r) => (
                            <div key={r.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                              <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '4px' }}>
                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                              </div>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#ddd' }}>"{r.content}"</p>
                              
                              {/* MEDIA RENDER */}
                              {(r.images?.length || r.video) && (
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                                  {r.video && (
                                    <video src={r.video} controls style={{ height: '80px', borderRadius: '4px', background: '#000' }} />
                                  )}
                                  {r.images?.map((img, i) => (
                                    <img key={i} src={img} alt="" style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
                                  ))}
                                </div>
                              )}
                              
                              <small style={{ color: 'var(--color-text-muted)' }}>- {r.userName} • {new Date(r.createdAt).toLocaleDateString()}</small>
                            </div>
                          ))
                        )}
                      </div>
  
                      {productReviews.length > 3 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                          <button 
                            disabled={reviewPage === 1} 
                            onClick={() => setReviewPage(p => p - 1)}
                            style={{ padding: '4px 12px', background: reviewPage === 1 ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)', color: reviewPage === 1 ? '#888' : '#000', borderRadius: '4px', border: 'none', cursor: reviewPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                          >&lt;</button>
                          <span style={{ fontSize: '0.9rem' }}>{reviewPage} / {Math.ceil(productReviews.length / 3)}</span>
                          <button 
                            disabled={reviewPage === Math.ceil(productReviews.length / 3)} 
                            onClick={() => setReviewPage(p => p + 1)}
                            style={{ padding: '4px 12px', background: reviewPage === Math.ceil(productReviews.length / 3) ? 'rgba(255,255,255,0.1)' : 'var(--color-accent)', color: reviewPage === Math.ceil(productReviews.length / 3) ? '#888' : '#000', borderRadius: '4px', border: 'none', cursor: reviewPage === Math.ceil(productReviews.length / 3) ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                          >&gt;</button>
                        </div>
                      )}

                      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <h4 style={{ margin: '0 0 1rem 0' }}>{language === 'vi' ? 'Viết đánh giá của bạn' : 'Write a review'}</h4>
                        {!user ? (
                          <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Vui lòng đăng nhập để đánh giá sản phẩm này.' : 'Please login to review this product.'}</p>
                            <button onClick={() => { handleCloseReview(); document.getElementById('auth-btn')?.click(); }} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                              {language === 'vi' ? 'Đăng nhập' : 'Login'}
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.9rem' }}>{language === 'vi' ? 'Điểm đánh giá:' : 'Rating:'}</span>
                              {[1,2,3,4,5].map(star => (
                                <span 
                                  key={star} 
                                  onClick={() => setReviewRating(star)}
                                  style={{ cursor: 'pointer', color: star <= reviewRating ? '#fbbf24' : '#444', fontSize: '1.25rem' }}
                                >★</span>
                              ))}
                            </div>
                            
                            {/* Media Upload Buttons */}
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--glass-border)', borderRadius: '8px', cursor: isUploadingMedia || reviewImages.length >= 4 ? 'not-allowed' : 'pointer', opacity: isUploadingMedia || reviewImages.length >= 4 ? 0.5 : 1 }}>
                                <ImageIcon size={18} />
                                <span>{language === 'vi' ? 'Thêm Ảnh (Tối đa 4)' : 'Add Image (Max 4)'}</span>
                                <input type="file" accept="image/*" multiple onChange={(e) => handleReviewMediaUpload(e, 'image')} style={{ display: 'none' }} disabled={isUploadingMedia || reviewImages.length >= 4} />
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--glass-border)', borderRadius: '8px', cursor: isUploadingMedia || reviewVideo ? 'not-allowed' : 'pointer', opacity: isUploadingMedia || reviewVideo ? 0.5 : 1 }}>
                                <Video size={18} />
                                <span>{language === 'vi' ? 'Thêm Video' : 'Add Video'}</span>
                                <input type="file" accept="video/mp4,video/quicktime" onChange={(e) => handleReviewMediaUpload(e, 'video')} style={{ display: 'none' }} disabled={isUploadingMedia || !!reviewVideo} />
                              </label>
                            </div>

                            {/* Media Previews */}
                            {(reviewImages.length > 0 || reviewVideo || isUploadingMedia) && (
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {isUploadingMedia && <div style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>Đang tải lên...</div>}
                                
                                {reviewVideo && (
                                  <div style={{ position: 'relative' }}>
                                    <video src={reviewVideo} style={{ height: '80px', borderRadius: '4px', background: '#000' }} />
                                    <button type="button" onClick={() => setReviewVideo(undefined)} style={{ position: 'absolute', top: -5, right: -5, background: 'black', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}><XCircle size={16} /></button>
                                  </div>
                                )}

                                {reviewImages.map((img, idx) => (
                                  <div key={idx} style={{ position: 'relative' }}>
                                    <img src={img} style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
                                    <button type="button" onClick={() => setReviewImages(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: -5, right: -5, background: 'black', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}><XCircle size={16} /></button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <textarea
                              value={reviewContent}
                              onChange={(e) => setReviewContent(e.target.value)}
                              placeholder={language === 'vi' ? 'Nhập nội dung đánh giá...' : 'Write your review here...'}
                              rows={3}
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                              required
                            />
                            <button type="submit" disabled={isSubmittingReview || !reviewContent.trim()} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem', opacity: (isSubmittingReview || !reviewContent.trim()) ? 0.5 : 1 }}>
                              {isSubmittingReview ? '...' : (language === 'vi' ? 'Gửi đánh giá' : 'Submit Review')}
                            </button>
                          </form>
                        )}
                      </div>

                    
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.1 }}
              style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', height: '100%' }}
              className="pd-section-panel"
            >
            <h2 style={{ marginBottom: '1rem' }}>{language === 'vi' ? 'Chất liệu' : 'Material'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', overflow: 'hidden' }}>
              {/* PLA Option */}
              <button 
                onClick={() => { if(isEffectivelyCrafting) { setSelectedMaterial('PLA'); setIsCartExpanded(true); } }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${selectedMaterial === 'PLA' ? '#4ade80' : 'var(--glass-border)'}`,
                  background: selectedMaterial === 'PLA' ? 'rgba(74, 222, 128, 0.1)' : 'var(--color-surface)',
                  color: selectedMaterial === 'PLA' ? '#4ade80' : 'var(--color-text)',
                  cursor: !isEffectivelyCrafting ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden', minWidth: 0,
                  opacity: !isEffectivelyCrafting && selectedMaterial !== 'PLA' ? 0.3 : 1,
                  pointerEvents: !isEffectivelyCrafting && selectedMaterial !== 'PLA' ? 'none' : 'auto'
                }}
              >
                <FilamentSpool color={selectedMaterial === 'PLA' ? '#4ade80' : 'var(--color-text-muted)'} isActive={selectedMaterial === 'PLA'} />
                <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>PLA</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{language === 'vi' ? 'Mặc định' : 'Default'}</span>
              </button>

              {/* PETG Option */}
              <button 
                onClick={() => { if(isEffectivelyCrafting) { setSelectedMaterial('PETG'); setIsCartExpanded(true); } }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${selectedMaterial === 'PETG' ? '#fbbf24' : 'var(--glass-border)'}`,
                  background: selectedMaterial === 'PETG' ? 'rgba(251, 191, 36, 0.1)' : 'var(--color-surface)',
                  color: selectedMaterial === 'PETG' ? '#fbbf24' : 'var(--color-text)',
                  cursor: !isEffectivelyCrafting ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden', minWidth: 0,
                  opacity: !isEffectivelyCrafting && selectedMaterial !== 'PETG' ? 0.3 : 1,
                  pointerEvents: !isEffectivelyCrafting && selectedMaterial !== 'PETG' ? 'none' : 'auto'
                }}
              >
                <FilamentSpool color={selectedMaterial === 'PETG' ? '#fbbf24' : 'var(--color-text-muted)'} isActive={selectedMaterial === 'PETG'} />
                <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>PETG</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>+20% {language === 'vi' ? 'Giá' : 'Price'}</span>
              </button>
            </div>

            {/* Explanation Box */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, wordBreak: 'break-word', wordWrap: 'break-word' }}>
              {language === 'vi' ? (
                <>
                  {selectedMaterial === 'PLA' && (
                    <p><strong style={{ color: 'var(--color-text)' }}>PLA (Polylactic Acid):</strong> Nhựa phân hủy sinh học thân thiện với môi trường, nguồn gốc từ tinh bột ngô. Cho độ nét in cực cao, màu sắc đẹp, phù hợp trưng bày trong nhà. Giá thành rẻ hơn.</p>
                  )}
                  {selectedMaterial === 'PETG' && (
                    <p><strong style={{ color: 'var(--color-text)' }}>PETG (Polyethylene Terephthalate Glycol):</strong> Độ bền vật lý cao hơn, dẻo dai và chịu nhiệt tốt hơn PLA. Phù hợp nếu bạn cần mô hình chắc chắn hơn hoặc để gần cửa sổ có nắng. Giá cao hơn 20%.</p>
                  )}
                </>
              ) : (
                <>
                  {selectedMaterial === 'PLA' && (
                    <p><strong style={{ color: 'var(--color-text)' }}>PLA (Polylactic Acid):</strong> Eco-friendly, biodegradable plastic derived from corn starch. Offers ultra-high print detail and beautiful colors, perfect for indoor display. Lower cost.</p>
                  )}
                  {selectedMaterial === 'PETG' && (
                    <p><strong style={{ color: 'var(--color-text)' }}>PETG:</strong> Higher physical durability, more flexible, and better heat resistance than PLA. Suitable if you need a sturdier model or plan to place it near sunny windows. Costs 20% more.</p>
                  )}
                </>
              )}
            </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
                style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', height: '100%' }}
              >
              <h2 style={{ marginBottom: '1.5rem' }}>{t('size')}</h2>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', flexWrap: 'nowrap' }}>
                {/* Ruler + Silhouette Container */}
                <div style={{ 
                  flex: '0 0 clamp(120px, 45%, 170px)', 
                  minHeight: '190px', 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  justifyContent: 'center', 
                  background: 'var(--color-surface)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  paddingBottom: '0px',
                  position: 'relative'
                }}>
                  {/* Ruler */}
                  <div style={{
                    position: 'absolute', left: '10px', bottom: '0px',
                    height: isEffectivelyCrafting ? '175px' : '110px',
                    borderLeft: '2px solid rgba(251, 191, 36, 0.5)'
                  }}>
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={`tick-${i}`} style={{
                        position: 'absolute', bottom: `${(i + 1) * 12}px`, left: 0,
                        width: (i + 1) % 5 === 0 ? '7px' : '4px',
                        height: '1px', background: 'rgba(251, 191, 36, 0.3)'
                      }}></div>
                    ))}

                    {isEffectivelyCrafting ? (
                      <>
                        {[
                          { label: '45cm', bottom: 84, active: selectedSize === 'SCALE_1_10' },
                          { label: '80cm', bottom: 162, active: selectedSize === 'SCALE_1_18' },
                        ].map(tick => (
                          <React.Fragment key={tick.label}>
                            <div style={{
                              position: 'absolute', bottom: `${tick.bottom}px`, left: 0,
                              width: '16px', height: '2px',
                              background: tick.active ? '#fbbf24' : 'rgba(251,191,36,0.6)',
                              transition: 'all 0.3s', zIndex: 2
                            }}></div>
                            <span style={{
                              position: 'absolute', bottom: `${tick.bottom - 10}px`, left: '22px',
                              fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24',
                              opacity: tick.active ? 1 : 0,
                              transform: tick.active ? 'translateX(0)' : 'translateX(-5px)',
                              transition: 'all 0.3s', whiteSpace: 'nowrap'
                            }}>{tick.label}</span>
                          </React.Fragment>
                        ))}
                      </>
                    ) : (
                      <>
                        <div style={{
                          position: 'absolute', bottom: '84px', left: 0,
                          width: '16px', height: '2px', background: '#fbbf24', zIndex: 2
                        }}></div>
                        <span style={{
                          position: 'absolute', bottom: '74px', left: '22px',
                          fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24', whiteSpace: 'nowrap'
                        }}>{product.dimensions || '?'}</span>
                      </>
                    )}
                  </div>

                  <motion.div
                    animate={{ scale: isEffectivelyCrafting ? (selectedSize === 'SCALE_1_18' ? 1.2 : 0.7) : 0.7 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    style={{ transformOrigin: 'bottom center', marginLeft: '60px' }}
                  >
                    <LegoSilhouette scale={1.8} color="var(--color-accent)" />
                  </motion.div>
                </div>

                {/* Size Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
                  {isEffectivelyCrafting ? (
                    <>
                      {[
                        { id: 'SCALE_1_10', label: '1:10', cm: '45cm' },
                        { id: 'SCALE_1_18', label: '1:18', cm: '80cm' },
                      ].map(opt => {
                        const isSelected = selectedSize === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => { setSelectedSize(opt.id); setIsCartExpanded(true); }}
                            style={{
                              display: 'flex', flexDirection: 'column',
                              justifyContent: 'center', alignItems: 'center',
                              padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                              border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--glass-border)'}`,
                              background: isSelected ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                              color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
                              transition: 'all 0.2s', cursor: 'pointer', gap: '2px'
                            }}
                          >
                            <span style={{ fontWeight: 900, fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', letterSpacing: '0.5px' }}>{opt.label}</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 600 }}>{opt.cm}</span>
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'center', alignItems: 'center',
                      padding: '1.25rem 1rem', borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--color-accent)',
                      background: 'rgba(74, 222, 128, 0.05)',
                      color: 'var(--color-accent)', gap: '4px'
                    }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.7, letterSpacing: '1px' }}>
                        {language === 'vi' ? 'Kích thước thực' : 'Actual Size'}
                      </span>
                      <span style={{ fontWeight: 900, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', letterSpacing: '0.5px' }}>
                        {product.dimensions || (language === 'vi' ? 'Liên hệ' : 'Contact us')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              </motion.div>
          </div>

          {/* Crafting Progress Bar UI */}
          {isEffectivelyCrafting && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 }}
              style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}
            >
              <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="#f59e0b" /> 
                {language === 'vi' ? 'QUY TRÌNH CHẾ TÁC DỰ KIẾN' : 'Estimated Crafting Process'}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {language === 'vi' ? `Tổng thời gian: khoảng ${craftTimeDays} ngày` : `Total time: approx ${craftTimeDays} days`}
              </p>
              
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0 5%' }}>
                {/* Line behind steps */}
                <div style={{ position: 'absolute', top: '20px', left: '15%', right: '15%', height: '12px', background: 'var(--glass-border)', zIndex: 0, borderRadius: '6px' }}>
                   {/* Animated fill line */}
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '50%' }}
                     transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                     style={{ height: '100%', background: '#f59e0b', borderRadius: '6px', boxShadow: '0 0 14px rgba(245,158,11,0.6)' }}
                   />
                </div>
                
                {/* Step 1: Order Placed */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.75rem', width: '80px' }}>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', boxShadow: '0 0 15px rgba(74, 222, 128, 0.4)' }}
                  >
                    <ClipboardCheck size={24} />
                  </motion.div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', display: 'block' }}>
                      {language === 'vi' ? 'Đặt Hàng' : 'Order Placed'}
                    </span>
                  </div>
                </div>

                {/* Step 2: Crafting */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.75rem', width: '80px' }}>
                  <motion.div 
                    animate={{ rotate: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-surface)', border: '2px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}
                  >
                    <Hammer size={24} />
                  </motion.div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', display: 'block' }}>
                      {language === 'vi' ? 'Chế Tác' : 'Crafting'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      ({craftTimeDays} {language === 'vi' ? 'ngày' : 'days'})
                    </span>
                  </div>
                </div>

                {/* Step 3: Shipped */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.75rem', width: '80px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-surface)', border: '2px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                    <Truck size={24} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block' }}>
                      {language === 'vi' ? 'Giao Hàng' : 'Shipped'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 }}
            style={{ padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}
          >
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gift size={20} color="var(--color-accent)" /> 
              {language === 'vi' ? 'HỘP MICA BẢO VỆ' : 'PROTECTIVE MICA BOX'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
        {/* Engraving & Self-assembly */}
        {isEffectivelyCrafting && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {/* Engraving Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', border: `1px solid ${isEngravingSelected ? 'var(--color-accent)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-sm)', background: isEngravingSelected ? 'rgba(74,222,128,0.05)' : 'rgba(0,0,0,0.2)', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => { 
                  if (!isEngravingSelected) {
                    setIsEngravingSelected(true);
                    setIsEngravingInputVisible(true);
                    setIsCartExpanded(true);
                  } else {
                    setIsEngravingSelected(false);
                    setIsEngravingInputVisible(false);
                    setEngravingText('');
                  }
                }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isEngravingSelected ? 'var(--color-accent)' : 'var(--color-text)' }}>{language === 'vi' ? 'Khắc tên / Lời nhắn' : 'Custom Engraving'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{language === 'vi' ? '(Miễn phí)' : '(Free)'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${isEngravingSelected ? 'var(--color-accent)' : 'var(--glass-border)'}`, background: isEngravingSelected ? 'var(--color-accent)' : 'transparent', color: isEngravingSelected ? '#000' : 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {isEngravingSelected ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>
              
              {/* Text Input (conditionally rendered) */}
              <AnimatePresence>
                {isEngravingInputVisible && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        placeholder={language === 'vi' ? 'Nhập nội dung cần khắc...' : 'Enter text to engrave...'}
                        style={{ flex: 1, width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-accent)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                        autoFocus
                      />
                      <button 
                        onClick={(e) => { e.preventDefault(); setIsEngravingInputVisible(false); setIsCartExpanded(true); }}
                        style={{ padding: '0 1rem', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        {language === 'vi' ? 'Xong' : 'Done'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Self Assembly Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', border: `1px solid ${isSelfAssembly ? 'var(--color-accent)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-sm)', background: isSelfAssembly ? 'rgba(74,222,128,0.05)' : 'rgba(0,0,0,0.2)', transition: 'all 0.2s', cursor: 'pointer', height: 'fit-content' }} onClick={() => { setIsSelfAssembly(!isSelfAssembly); if(!isSelfAssembly) setIsCartExpanded(true); }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isSelfAssembly ? 'var(--color-accent)' : 'var(--color-text)' }}>{language === 'vi' ? 'Tự lắp ráp' : 'Self Assembly'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{language === 'vi' ? '(Nhận chi tiết rời)' : '(Unassembled kit)'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${isSelfAssembly ? 'var(--color-accent)' : 'var(--glass-border)'}`, background: isSelfAssembly ? 'var(--color-accent)' : 'transparent', color: isSelfAssembly ? '#000' : 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  {isSelfAssembly ? <Minus size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>

          </div>
        )}


              {/* Mica Box */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                  {/* Standard Box */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', border: `1px solid ${selectedMicaBox === 'standard' ? 'var(--color-accent)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-sm)', background: selectedMicaBox === 'standard' ? 'rgba(74,222,128,0.05)' : 'rgba(0,0,0,0.2)', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => { setSelectedMicaBox(selectedMicaBox === 'standard' ? '' : 'standard'); setIsCartExpanded(true); }}>
                    <img src="https://s3.vn-hcm-1.vietnix.cloud/benchydrop/images/mica-standard.jpg" alt="Mica Standard" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }} onError={e => e.currentTarget.src = 'https://placehold.co/100x100?text=Mica+Box'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: selectedMicaBox === 'standard' ? 'var(--color-accent)' : 'var(--color-text)' }}>{language === 'vi' ? 'Hộp Mica Thường' : 'Standard Mica Box'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>+150.000 ₫</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{(selectedSize || '').includes('1000') ? '80x40x30 cm' : (selectedSize || '').includes('400') ? '50x20x20 cm' : '30x15x15 cm'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a href="/products/accessories" target="_blank" title="Chi tiết hộp" onClick={e => e.stopPropagation()} style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', padding: '0.25rem' }}>
                        <Info size={16} />
                      </a>
                      <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${selectedMicaBox === 'standard' ? 'var(--color-accent)' : 'var(--glass-border)'}`, background: selectedMicaBox === 'standard' ? 'var(--color-accent)' : 'transparent', color: selectedMicaBox === 'standard' ? '#000' : 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        {selectedMicaBox === 'standard' ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* LED Box */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', border: `1px solid ${selectedMicaBox === 'led' ? 'var(--color-accent)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-sm)', background: selectedMicaBox === 'led' ? 'rgba(74,222,128,0.05)' : 'rgba(0,0,0,0.2)', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => { setSelectedMicaBox(selectedMicaBox === 'led' ? '' : 'led'); setIsCartExpanded(true); }}>
                    <img src="https://s3.vn-hcm-1.vietnix.cloud/benchydrop/images/mica-led.jpg" alt="Mica LED" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }} onError={e => e.currentTarget.src = 'https://placehold.co/100x100?text=LED+Box'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: selectedMicaBox === 'led' ? 'var(--color-accent)' : 'var(--color-text)' }}>{language === 'vi' ? 'Hộp Mica + Đèn LED' : 'Mica Box with LED'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>+250.000 ₫</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{(selectedSize || '').includes('1000') ? '80x40x30 cm' : (selectedSize || '').includes('400') ? '50x20x20 cm' : '30x15x15 cm'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a href="/products/accessories" target="_blank" title="Chi tiết hộp" onClick={e => e.stopPropagation()} style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', padding: '0.25rem' }}>
                        <Info size={16} />
                      </a>
                      <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${selectedMicaBox === 'led' ? 'var(--color-accent)' : 'var(--glass-border)'}`, background: selectedMicaBox === 'led' ? 'var(--color-accent)' : 'transparent', color: selectedMicaBox === 'led' ? '#000' : 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        {selectedMicaBox === 'led' ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Buy button moved to left column */}

          {/* Tabs Section */}
          <div style={{ marginTop: '2.5rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
            {/* Tab Headers */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', overflowX: 'auto' }} className="hide-scrollbar">
              {product.description?.[language] && (
              <button 
                onClick={() => setActiveTab('desc')}
                style={{ flex: 1, padding: '1rem', background: activeTab === 'desc' ? 'rgba(74, 222, 128, 0.1)' : 'transparent', borderBottom: activeTab === 'desc' ? '2px solid var(--color-accent)' : '2px solid transparent', color: activeTab === 'desc' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}
              >
                {t('description')}
              </button>
              )}
              <button 
                onClick={() => setActiveTab('specs')}
                style={{ flex: 1, padding: '1rem', background: activeTab === 'specs' ? 'rgba(74, 222, 128, 0.1)' : 'transparent', borderBottom: activeTab === 'specs' ? '2px solid var(--color-accent)' : '2px solid transparent', color: activeTab === 'specs' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}
              >
                {t('specifications')}
              </button>
              <button 
                onClick={() => setActiveTab('tags')}
                style={{ flex: 1, padding: '1rem', background: activeTab === 'tags' ? 'rgba(74, 222, 128, 0.1)' : 'transparent', borderBottom: activeTab === 'tags' ? '2px solid var(--color-accent)' : '2px solid transparent', color: activeTab === 'tags' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none', whiteSpace: 'nowrap' }}
              >
                Tags
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ padding: '1.5rem', minHeight: '150px' }}>
              <AnimatePresence mode="wait">
                {activeTab === 'desc' && (
                  <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <p style={{ lineHeight: 1.6, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                      {product.description[language]}
                    </p>
                  </motion.div>
                )}
                
                {activeTab === 'specs' && (
                  <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{t('spec_material')}</span>
                        <span style={{ fontWeight: 500, textAlign: 'right' }}>{product.availableMaterials ? product.availableMaterials.join(', ') : t('material_val')}</span>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{t('spec_finish')}</span>
                        <span style={{ fontWeight: 500, textAlign: 'right' }}>{t('finish_val')}</span>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{t('size')}</span>
                        <span style={{ fontWeight: 500, textAlign: 'right' }}>{product.dimensions ? product.dimensions : '300% (21cm), 400% (28cm), 1000% (70cm)'}</span>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{t('spec_weight')}</span>
                        <span style={{ fontWeight: 500, textAlign: 'right' }}>{product.weight ? product.weight : t('weight_val')}</span>
                      </li>
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'tags' && (
                  <motion.div key="tags" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {['Mô Hình Lắp Ráp', 'Lego 3D', 'Decor', product.category].map(tag => (
                        <span key={tag} style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', color: 'var(--color-accent)', border: '1px solid rgba(74, 222, 128, 0.3)', fontWeight: 600 }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Related Products & Best Sellers (50/50 Split) */}
      <div className="bottom-split-container">
        {/* Related Products */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LegoHeadIcon size={32} />
              {(() => {
                const sameCategory = products.filter(p => p.category === product.category && p.id !== product.id);
                return sameCategory.length > 0
                  ? (language === 'vi' ? 'Sản Phẩm Liên Quan' : 'Related Products')
                  : (language === 'vi' ? 'Sản Phẩm Hàng Sẵn' : 'In Stock Products');
              })()}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => scrollSlider(relatedRef, 'left')}
                className="chamfer-btn"
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.07)', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollSlider(relatedRef, 'right')}
                className="chamfer-btn"
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.07)', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </h2>
          <div 
            ref={relatedRef}
            className="hide-scrollbar"
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto', 
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              paddingBottom: '1rem'
            }}
          >
            {(() => {
              const sameCategory = products.filter(p => p.category === product.category && p.id !== product.id);
              const displayList = sameCategory.length > 0
                ? sameCategory.slice(0, 10)
                : products.filter(p => p.isReadyStock && p.stock > 0 && p.id !== product.id).slice(0, 10);
              return displayList.map((p, idx) => (
                <div key={p.id} style={{ flex: '0 0 calc(50% - 0.5rem)', width: 'calc(50% - 0.5rem)', scrollSnapAlign: 'start' }}>
                  <ProductCard product={p} idx={idx} listMode={false} />
                </div>
              ));
            })()}
          </div>
        </div>
        {/* Best Sellers */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LegoHeadIcon size={32} />
              {language === 'vi' ? 'Sản Phẩm Bán Chạy' : 'Best Sellers'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => scrollSlider(bestSellersRef, 'left')}
                className="chamfer-btn"
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.07)', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollSlider(bestSellersRef, 'right')}
                className="chamfer-btn"
                style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.07)', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </h2>
          <div 
            ref={bestSellersRef}
            className="hide-scrollbar"
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto', 
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              paddingBottom: '1rem'
            }}
          >
            {[...products].sort((a, b) => b.likes - a.likes).filter(p => (product.category === '3d-printer' ? p.category === '3d-printer' : p.category !== '3d-printer') && p.id !== product.id).slice(0, 10).map((p, idx) => (
              <div key={p.id} style={{ flex: '0 0 calc(50% - 0.5rem)', width: 'calc(50% - 0.5rem)', scrollSnapAlign: 'start' }}>
                <ProductCard product={p} idx={idx} listMode={false} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .bottom-split-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        @keyframes btn-shine {
          0% { left: -100%; opacity: 0; }
          15% { left: 100%; opacity: 0.8; }
          100% { left: 100%; opacity: 0; }
        }
        .bling-btn {
          position: relative;
          overflow: hidden;
        }
        .bling-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
          transform: skewX(-20deg);
          animation: btn-shine 5s infinite;
        }
        .size-option-btn {
          width: auto;
          flex: 1;
        }
        .sticky-cart-wrapper {
          position: sticky;
          top: 160px;
          z-index: 50;
          margin-top: 2rem;
        }
        .material-size-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 1280px) {
          .material-size-wrapper {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 1023px) {
          .sticky-cart-wrapper {
            position: fixed;
            top: auto !important;
            bottom: 20px;
            left: 1rem;
            right: 1rem;
            z-index: 999;
            margin: 0;
            padding: 0;
          }
          .container {
            padding-bottom: 40px !important;
          }
        }
        @media (max-width: 768px) {
          .sticky-cart-wrapper {
            top: auto !important;
            bottom: 80px;
          }
          .container {
            padding-bottom: 60px !important;
          }
        }
        @media (max-width: 639px) {
          .size-options-container {
            gap: 0.5rem !important;
            flex-wrap: nowrap !important;
          }
          .size-option-btn {
            width: auto !important;
            min-width: 0 !important;
            flex: 1 !important;
            padding: 1rem 0.25rem !important;
          }
          .size-option-btn .size-text {
            font-size: 1.1rem !important;
          }
          .size-option-btn .height-text {
            font-size: 0.75rem !important;
          }
        }
        @media (min-width: 1024px) {
          .bottom-split-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
          .bottom-split-container .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
         .view-toggle-mobile {
          margin-bottom: 2rem;
        }
        @media (min-width: 1024px) {
          .view-toggle-mobile {
            display: none !important;
          }
          .hide-on-desktop {
            display: none !important;
          }
        }
      `}</style>
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.95)', zIndex: 1000,
              display: 'flex', flexDirection: 'column',
              padding: '2rem', backdropFilter: 'blur(10px)'
            }}
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 1010 }}
            >
              <X size={32} />
            </button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', height: '100%' }}>
              <AnimatePresence mode="popLayout">
                <motion.img 
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  src={displayImages[activeImageIndex]} 
                  style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }} 
                  alt="large preview" 
                />
              </AnimatePresence>
              
              {/* Prev / Next controls for Lightbox */}
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="chamfer-btn" style={{ position: 'absolute', left: '2rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <ChevronLeft size={32} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="chamfer-btn" style={{ position: 'absolute', right: '2rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <ChevronRight size={32} />
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="hide-scrollbar" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem', justifyContent: 'center', marginTop: 'auto' }}>
              {displayImages.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  onClick={() => {
                    setSlideDirection(idx > activeImageIndex ? 1 : -1);
                    setActiveImageIndex(idx);
                  }}
                  style={{ 
                    height: '80px', width: '80px', objectFit: 'contain', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px',
                    border: idx === activeImageIndex ? '2px solid var(--color-accent)' : '2px solid transparent',
                    opacity: idx === activeImageIndex ? 1 : 0.5,
                    transition: 'all 0.2s'
                  }} 
                  alt={`thumbnail ${idx}`} 
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

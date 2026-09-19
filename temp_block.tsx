          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            style={{ marginBottom: '2rem', marginTop: '2rem' }}
          >
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem' }}>
              {language === 'vi' ? 'Đặc Quyền & Chính Sách' : 'Exclusive Policies'}
            </h3>
            
            
            <div className="policies-grid">
              {/* Policy 1 */}
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <ShieldCheck size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Bảo hành rơi vỡ' : 'Breakage Warranty'}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  {language === 'vi' ? 'Bảo hành rơi vỡ 1 lần miễn phí cho mọi sản phẩm.' : '1-time free replacement/warranty for accidental breakage.'}
                </p>
              </div>
              
              {/* Policy 2 */}
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <Wrench size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Chế tác lại trọn đời' : 'Lifetime Re-crafting'}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  {language === 'vi' ? 'Hỗ trợ chế tác lại sản phẩm với giá tốt ưu đãi trọn đời.' : 'Lifetime support for re-crafting products at a favorable price.'}
                </p>
              </div>

              {/* Policy 3 */}
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <Gift size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Dấu ấn cá nhân' : 'Personal Mark'}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  {language === 'vi' ? 'Khắc tên miễn phí lên mô hình cho bản thân hoặc làm quà tặng.' : 'Free name engraving on the model for yourself or as a gift.'}
                </p>
              </div>

              {/* Policy 4 */}
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <RefreshCw size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{language === 'vi' ? 'Thu mua lại' : 'Trade-in Support'}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  {language === 'vi' ? 'Hỗ trợ thu mua lại các sản phẩm tùy theo tình trạng thực tế.' : 'Support for buying back products depending on their actual condition.'}
                </p>
              </div>
            </div>
          </div>
          </motion.div>

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
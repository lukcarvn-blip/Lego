const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const startStr = '{/* Summary Note */}';
const p1 = code.indexOf(startStr);
const p2 = code.indexOf('</div>', code.indexOf('</ul>', p1)) + 6;
// There is one more </div> to close summary-note-container
const p3 = code.indexOf('</div>', p2) + 6;

const oldBlock = code.substring(p1, p3);

const newBlock = `{/* Summary Note */}
                    <div className="summary-note-container" style={{ width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      {/* Toggle header - only on mobile */}
                      {isMobile && (
                        <button
                          onClick={() => setIsSummaryOpen(prev => !prev)}
                          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(0,0,0,0.85)' }}
                        >
                          <span style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                            <ClipboardCheck size={16} style={{ marginRight: '6px' }} />
                            {language === 'vi' ? 'Thông tin lựa chọn' : 'Selected options'}
                          </span>
                          <span style={{ fontSize: '1rem', transition: 'transform 0.25s', display: 'inline-block', transform: isSummaryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                        </button>
                      )}
                      
                      {/* Collapsible body */}
                      <AnimatePresence>
                        {(!isMobile || isSummaryOpen) && (
                          <motion.div
                            initial={isMobile ? { height: 0, opacity: 0 } : false}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={isMobile ? { height: 0, opacity: 0 } : undefined}
                            style={{ overflow: 'hidden' }}
                          >
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
                                    {isFastCrafting ? <span style={{ color: '#b91c1c', marginLeft: '6px', fontWeight: 'bold' }}>({language === 'vi' ? 'Đã bật tăng tốc' : 'Fast mode ON'} <Rocket size={14} style={{ display: 'inline-block', verticalAlign: 'text-bottom' }} />)</span> : <span style={{ color: 'rgba(0,0,0,0.5)', marginLeft: '6px', fontSize: '0.8rem' }}>({language === 'vi' ? 'Nhấn' : 'Tap'} <Rocket size={14} style={{ display: 'inline-block', verticalAlign: 'text-bottom' }} /> {language === 'vi' ? 'để rút ngắn' : 'to speed up'})</span>}
                                  </li>
                                )}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Done replacing summary block');

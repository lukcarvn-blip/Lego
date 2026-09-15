const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = `                  )}
                </div>

              </div>
            </div>
          </form>`;

const replacement = `                  )}
                </div>
                
                {/* Character Profile (Bio, Power, Alignment) */}
                <div style={{ ...panelStyle, padding: '1rem', gridColumn: '1 / -1' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={18} /> Hồ sơ nhân vật (Vũ trụ thu nhỏ)
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <InputField label="Phe phái (Alignment)">
                      <select 
                        value={editingProduct.alignment || ''} 
                        onChange={e => setEditingProduct({...editingProduct, alignment: e.target.value as any})} 
                        style={inputStyle}
                      >
                        <option value="">Không phân loại (Neutral)</option>
                        <option value="Hero">Chính diện (Hero)</option>
                        <option value="Villain">Phản diện (Villain)</option>
                        <option value="Neutral">Trung lập (Neutral)</option>
                      </select>
                    </InputField>
                    
                    <InputField label="Chỉ số sức mạnh (0-100)">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={editingProduct.powerRanking || 0} 
                          onChange={e => setEditingProduct({...editingProduct, powerRanking: parseInt(e.target.value)})} 
                          style={{ flex: 1, accentColor: 'var(--color-accent)' }} 
                        />
                        <div style={{ width: '40px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                          {editingProduct.powerRanking || 0}
                        </div>
                      </div>
                    </InputField>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    <InputField label="Tiểu sử (Tiếng Việt)">
                      <textarea 
                        rows={3} 
                        placeholder="Nhập tiểu sử nhân vật bằng tiếng Việt..."
                        value={editingProduct.biography?.vi || ''} 
                        onChange={e => setEditingProduct({
                          ...editingProduct, 
                          biography: { ...(editingProduct.biography || {vi:'', en:''}), vi: e.target.value }
                        })} 
                        style={{ ...inputStyle, resize: 'vertical' }} 
                      />
                    </InputField>
                    
                    <InputField label="Tiểu sử (English)">
                      <textarea 
                        rows={3} 
                        placeholder="Enter character biography in English..."
                        value={editingProduct.biography?.en || ''} 
                        onChange={e => setEditingProduct({
                          ...editingProduct, 
                          biography: { ...(editingProduct.biography || {vi:'', en:''}), en: e.target.value }
                        })} 
                        style={{ ...inputStyle, resize: 'vertical' }} 
                      />
                    </InputField>
                  </div>
                </div>

              </div>
            </div>
          </form>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Admin.tsx', code, 'utf8');
console.log('Added character profile section to Admin.tsx');

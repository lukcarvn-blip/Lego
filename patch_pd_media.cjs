const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Add Image and Video to lucide-react imports
const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
code = code.replace(importRegex, (match, p1) => {
  if (!p1.includes('Image as ImageIcon')) {
    return match.replace(p1, p1 + ', Image as ImageIcon, Video, XCircle');
  }
  return match;
});

// 2. Add states for review media
const statesRegex = /const \[isSubmittingReview, setIsSubmittingReview\] = useState\(false\);/;
if (code.match(statesRegex) && !code.includes('reviewImages')) {
  code = code.replace(statesRegex, `const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewVideo, setReviewVideo] = useState<string | undefined>(undefined);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);`);
}

// 3. Add handleReviewMediaUpload before handleSubmitReview
const submitAnchor = `  const handleSubmitReview = async (e: React.FormEvent) => {`;
const mediaUploadFunc = `  const handleReviewMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
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

`;

if (code.includes(submitAnchor) && !code.includes('handleReviewMediaUpload')) {
  code = code.replace(submitAnchor, mediaUploadFunc + submitAnchor);
}

// 4. Update handleSubmitReview logic
const submitCallOld = `        content: reviewContent
      });
    }`;
const submitCallNew = `        content: reviewContent,
        images: reviewImages.length > 0 ? reviewImages : undefined,
        video: reviewVideo
      });
    }`;
code = code.replace(submitCallOld, submitCallNew);

const submitCleanupOld = `    setReviewContent('');
    setReviewRating(5);
    setIsSubmittingReview(false);`;
const submitCleanupNew = `    setReviewContent('');
    setReviewRating(5);
    setReviewImages([]);
    setReviewVideo(undefined);
    setIsSubmittingReview(false);`;
code = code.replace(submitCleanupOld, submitCleanupNew);


// 5. Update UI rendering of reviews
const reviewRenderOld = `                              <small style={{ color: 'var(--color-text-muted)' }}>- {r.userName} • {new Date(r.createdAt).toLocaleDateString()}</small>
                            </div>`;
const reviewRenderNew = `                              
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
                            </div>`;
if (code.includes(reviewRenderOld)) {
  code = code.replace(reviewRenderOld, reviewRenderNew);
}


// 6. Update the Form UI
const formTextareaAnchor = `<textarea
                              value={reviewContent}`;
const newFormInputs = `
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
                              value={reviewContent}`;
code = code.replace(formTextareaAnchor, newFormInputs);

fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Patched ProductDetails media uploads');

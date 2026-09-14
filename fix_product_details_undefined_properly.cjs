const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const anchor = `  if (!product) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.75rem 2rem' }}>Về trang chủ</Link>
      </div>
    );
  }`;

const newBlock = anchor + `

  const productReviews = reviews ? reviews.filter(r => r.productId === product.id && r.status === 'APPROVED') : [];
  const averageRating = productReviews.length > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1) : '5.0';

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    setIsSubmittingReview(true);
    await addReview({
      productId: product.id,
      userId: user?.uid || '',
      userName: user?.displayName || 'Ẩn danh',
      userAvatar: user?.photoURL || undefined,
      rating: reviewRating,
      content: reviewContent
    });
    setReviewContent('');
    setReviewRating(5);
    setIsSubmittingReview(false);
  };`;

if (code.includes(anchor) && !code.includes('const productReviews = reviews ? reviews.filter')) {
  code = code.replace(anchor, newBlock);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Fixed ProductDetails undefined product error properly');
} else {
  console.log('Could not find anchor or already exists');
}

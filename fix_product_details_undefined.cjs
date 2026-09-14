const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

// 1. Remove the incorrectly placed productReviews, averageRating, handleSubmitReview
code = code.replace(
  /const productReviews = reviews \? reviews\.filter\(r => r\.productId === product\.id && r\.status === 'APPROVED'\) : \[\];\s*const averageRating = productReviews\.length > 0 \? \(productReviews\.reduce\(\(sum, r\) => sum \+ r\.rating, 0\) \/ productReviews\.length\)\.toFixed\(1\) : '5\.0';/,
  ''
);

code = code.replace(
  /const handleSubmitReview = async \([^\{]+\{[\s\S]*?setIsSubmittingReview\(false\);\s*\};\s*/,
  ''
);

// 2. Add them after `if (!product) return <NotFound />;`
const anchor = `if (!product) return <NotFound />;`;
const newBlock = `if (!product) return <NotFound />;

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

code = code.replace(anchor, newBlock);
fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
console.log('Fixed ProductDetails undefined product error');

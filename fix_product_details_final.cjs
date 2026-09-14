const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8');

const regex = /if \(\!product\) \{\s*return <div className="container" style=\{\{ padding: '8rem 0', textAlign: 'center' \}\}>Product not found<\/div>;\s*\}/;
const match = code.match(regex);
if (match) {
  const newBlock = match[0] + `\n
  const productReviews = reviews ? reviews.filter(r => r.productId === product.id && r.status === 'APPROVED') : [];
  const averageRating = productReviews.length > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1) : '5.0';

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
        content: reviewContent
      });
    }
    setReviewContent('');
    setReviewRating(5);
    setIsSubmittingReview(false);
  };
`;
  code = code.replace(match[0], newBlock);
  fs.writeFileSync('src/pages/ProductDetails.tsx', code, 'utf8');
  console.log('Fixed ProductDetails undefined product error finally!');
} else {
  console.log('Match not found');
}

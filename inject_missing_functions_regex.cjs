const fs = require('fs');

let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

const regex = /const deleteBlogPost = async \([^\{]+\{[\s\S]*?\} catch \(e\) \{ console\.error\(e\); \}\s*\};/;
const match = code.match(regex);
if (match) {
  const injection = `
  const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    try {
      if (!user) {
        showToast(language === 'vi' ? 'Vui lòng đăng nhập để đánh giá' : 'Please login to review', 'error');
        return;
      }
      const newReview = {
        ...review,
        createdAt: new Date().toISOString(),
        status: 'PENDING'
      };
      await addDoc(collection(db, 'reviews'), newReview);
      showToast(language === 'vi' ? 'Đánh giá đã được gửi và đang chờ duyệt' : 'Review submitted and pending approval', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error adding review', 'error');
    }
  };

  const updateReviewStatus = async (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status });
      showToast(language === 'vi' ? 'Đã cập nhật trạng thái' : 'Status updated', 'success');
    } catch (e) { console.error(e); }
  };

  const deleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
      showToast(language === 'vi' ? 'Đã xoá đánh giá' : 'Review deleted', 'success');
    } catch (e) { console.error(e); }
  };
`;
  code = code.replace(match[0], match[0] + injection);
  fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
  console.log('Injected missing review functions (regex via file)');
} else {
  console.log('Not found regex');
}

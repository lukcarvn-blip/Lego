const fs = require('fs');

let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// Add states
const stateAnchor = `const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);`;
if (code.includes(stateAnchor) && !code.includes(`const [reviews, setReviews] = useState<Review[]>([])`)) {
  code = code.replace(stateAnchor, stateAnchor + '\n  const [reviews, setReviews] = useState<Review[]>([]);');
}

// Add snapshot listener
const listenerAnchor = `setBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      });`;
if (code.includes(listenerAnchor) && !code.includes(`collection(db, 'reviews')`)) {
  code = code.replace(listenerAnchor, listenerAnchor + `

      const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
      });`);
}

// Add cleanup
const cleanupAnchor = `unsubBlogPosts();`;
if (code.includes(cleanupAnchor) && !code.includes(`unsubReviews();`)) {
  code = code.replace(cleanupAnchor, cleanupAnchor + '\n      unsubReviews();');
}

// Add functions
const functionsAnchor = `const deleteBlogPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (e) { console.error(e); }
  };`;
if (code.includes(functionsAnchor) && !code.includes(`const addReview = async`)) {
  code = code.replace(functionsAnchor, functionsAnchor + `

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
  };`);
}

fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
console.log('Injected implementations');

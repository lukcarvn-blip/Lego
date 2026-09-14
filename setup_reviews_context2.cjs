const fs = require('fs');

let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// 1. Add Review interface right before Order
const reviewInterface = `
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Order {`;
code = code.replace(/export interface Order \{/g, reviewInterface);

// 2. Add to StoreContextType
const oldType = `  deleteBlogPost: (id: string) => Promise<void>;`;
const newType = `  deleteBlogPost: (id: string) => Promise<void>;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateReviewStatus: (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => Promise<void>;
  deleteReview: (id: string) => Promise<void>;`;
code = code.replace(oldType, newType);

// 3. Add reviews state
const oldState = `  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);`;
const newState = `  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);`;
code = code.replace(oldState, newState);

// 4. Add snapshot listener
const oldListener = `      const unsubBlogPosts = onSnapshot(collection(db, 'blog_posts'), (snapshot) => {
        setBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      });`;
const newListener = `      const unsubBlogPosts = onSnapshot(collection(db, 'blog_posts'), (snapshot) => {
        setBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      });

      const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
      });`;
code = code.replace(oldListener, newListener);

// 5. Add to cleanup
const oldCleanup = `      unsubBlogPosts();
    };
  }, []);`;
const newCleanup = `      unsubBlogPosts();
      unsubReviews();
    };
  }, []);`;
code = code.replace(oldCleanup, newCleanup);

// 6. Add functions
const oldFunctions = `  const deleteBlogPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (e) { console.error(e); }
  };`;
const newFunctions = `  const deleteBlogPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (e) { console.error(e); }
  };

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
  };`;
code = code.replace(oldFunctions, newFunctions);

// 7. Export functions
const oldExport = `        blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,`;
const newExport = `        blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
        reviews, addReview, updateReviewStatus, deleteReview,`;
code = code.replace(oldExport, newExport);

fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
console.log('StoreContext updated successfully');

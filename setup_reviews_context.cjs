const fs = require('fs');

let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// 1. Add Review interface
const reviewInterface = `
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  content: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Order {`;

code = code.replace(/export interface Order \{/g, reviewInterface);

// 2. Add to StoreContextType
const storeContextTypeRegex = /(orders: Order\[\];[\s\S]*?deleteBlogPost: \(id: string\) => Promise<void>;)/;
const storeContextTypeMatch = code.match(storeContextTypeRegex);
if (storeContextTypeMatch) {
  const newType = storeContextTypeMatch[1] + `
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateReviewStatus: (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => Promise<void>;
  deleteReview: (id: string) => Promise<void>;`;
  code = code.replace(storeContextTypeMatch[0], newType);
}

// 3. Add states and functions inside StoreProvider
const stateInjectionRegex = /(const \[blogPosts, setBlogPosts\] = useState<BlogPost\[\]>\(\[\]\);)/;
const stateInjectionMatch = code.match(stateInjectionRegex);
if (stateInjectionMatch) {
  const newStates = stateInjectionMatch[1] + `
  const [reviews, setReviews] = useState<Review[]>([]);`;
  code = code.replace(stateInjectionMatch[0], newStates);
}

// 4. Add Firestore listener for reviews
const useEffectFirebaseRegex = /(onSnapshot\(collection\(db, 'blog_posts'\), \(snapshot\) => \{[\s\S]*?\}\);)/;
const useEffectFirebaseMatch = code.match(useEffectFirebaseRegex);
if (useEffectFirebaseMatch) {
  const newListener = useEffectFirebaseMatch[1] + `

      const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
      });`;
  code = code.replace(useEffectFirebaseMatch[0], newListener);
}

// 5. Add cleanup for unsubReviews
const cleanupRegex = /(unsubProducts\(\);[\s\S]*?unsubBlogPosts\(\);)/;
const cleanupMatch = code.match(cleanupRegex);
if (cleanupMatch) {
  code = code.replace(cleanupMatch[0], cleanupMatch[0] + '\n      unsubReviews();');
}

// 6. Add functions
const functionsRegex = /(const addBlogPost = async \(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>\) => \{[\s\S]*?\} catch \(e\) \{ console\.error\(e\); \}\n  \};)/;
const functionsMatch = code.match(functionsRegex);
if (functionsMatch) {
  const reviewFunctions = `
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
  code = code.replace(functionsMatch[0], functionsMatch[0] + '\n' + reviewFunctions);
}

// 7. Export from context
const exportRegex = /(blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,)/;
const exportMatch = code.match(exportRegex);
if (exportMatch) {
  code = code.replace(exportMatch[0], exportMatch[0] + '\n        reviews, addReview, updateReviewStatus, deleteReview,');
}

fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
console.log('Updated StoreContext with Review system');

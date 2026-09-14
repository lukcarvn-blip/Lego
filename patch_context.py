import re

with open('src/context/StoreContext.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Interface
code = code.replace("export interface Order {", """export interface Review {
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

export interface Order {""")

# 2. StoreContextType
code = code.replace("  deleteBlogPost: (id: string) => Promise<void>;", """  deleteBlogPost: (id: string) => Promise<void>;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateReviewStatus: (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => Promise<void>;
  deleteReview: (id: string) => Promise<void>;""")

# 3. State
code = code.replace("const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);", """const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);""")

# 4. Snapshot
code = code.replace("""      const unsubBlogPosts = onSnapshot(collection(db, 'blog_posts'), (snapshot) => {
        setBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      });""", """      const unsubBlogPosts = onSnapshot(collection(db, 'blog_posts'), (snapshot) => {
        setBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      });

      const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
      });""")

# 5. Cleanup
code = code.replace("""      unsubBlogPosts();
    };
  }, []);""", """      unsubBlogPosts();
      unsubReviews();
    };
  }, []);""")

# 6. Functions (without second arg for showToast)
old_func = """  const deleteBlogPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (e) { console.error(e); }
  };"""

new_func = """  const deleteBlogPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (e) { console.error(e); }
  };

  const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    try {
      if (!user) {
        showToast(language === 'vi' ? 'Vui lòng đăng nhập để đánh giá' : 'Please login to review');
        return;
      }
      const newReview = {
        ...review,
        createdAt: new Date().toISOString(),
        status: 'PENDING'
      };
      await addDoc(collection(db, 'reviews'), newReview);
      showToast(language === 'vi' ? 'Đánh giá đã được gửi và đang chờ duyệt' : 'Review submitted and pending approval');
    } catch (e) {
      console.error(e);
      showToast('Error adding review');
    }
  };

  const updateReviewStatus = async (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status });
      showToast(language === 'vi' ? 'Đã cập nhật trạng thái' : 'Status updated');
    } catch (e) { console.error(e); }
  };

  const deleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
      showToast(language === 'vi' ? 'Đã xoá đánh giá' : 'Review deleted');
    } catch (e) { console.error(e); }
  };"""

code = code.replace(old_func, new_func)

# 7. Exports
code = code.replace("        blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,", """        blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
        reviews, addReview, updateReviewStatus, deleteReview,""")

with open('src/context/StoreContext.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched StoreContext")

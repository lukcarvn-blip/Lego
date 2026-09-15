const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// 1. Add savedCharacters to AppUser
code = code.replace(
  /export interface AppUser \{[\s\S]*?uid: string;/g,
  `export interface AppUser {
  uid: string;
  savedCharacters?: string[];`
);

// 2. Add saveCharacter and unsaveCharacter to StoreContextType
code = code.replace(
  /addReview: \(review: Omit<Review, 'id' \| 'createdAt' \| 'status'>\) => Promise<void>;/g,
  `addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  saveCharacter: (productId: string) => Promise<void>;
  unsaveCharacter: (productId: string) => Promise<void>;`
);

// 3. Implement the functions
const funcs = `
  const saveCharacter = async (productId: string) => {
    if (!user) {
      showToast(language === 'vi' ? 'Vui lòng đăng nhập để lưu' : 'Please login to save');
      return;
    }
    const saved = user.savedCharacters || [];
    if (!saved.includes(productId)) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          savedCharacters: [...saved, productId]
        });
        showToast(language === 'vi' ? 'Đã thêm vào Không Gian Vũ Trụ' : 'Added to Universe Space');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const unsaveCharacter = async (productId: string) => {
    if (!user) return;
    const saved = user.savedCharacters || [];
    if (saved.includes(productId)) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          savedCharacters: saved.filter(id => id !== productId)
        });
        showToast(language === 'vi' ? 'Đã xóa khỏi Không Gian Vũ Trụ' : 'Removed from Universe Space');
      } catch (e) {
        console.error(e);
      }
    }
  };
`;

code = code.replace(
  /const addReview = async \([\s\S]*?catch \(e\) \{ console\.error\(e\); \}\n  \};/g,
  `$&
${funcs}`
);

// 4. Export them
code = code.replace(
  /addReview,\n\s*deleteReview,/g,
  `addReview,
    deleteReview,
    saveCharacter,
    unsaveCharacter,`
);

fs.writeFileSync('src/context/StoreContext.tsx', code, 'utf8');
console.log('Updated StoreContext.tsx');

export type ProductSize = 'Size 300' | 'Size 400' | 'Size 1000';

export interface LocalizedString {
  vi: string;
  en: string;
}

export interface Product {
  id: string;
  sku?: string;
  name: LocalizedString;
  category: string;
  price: number; // in USD
  rating: number;
  reviews: number;
  likes: number;
  views?: number;
  estimatedPrintTime: string; // e.g. "2-4 days"
  images: string[];
  description: LocalizedString;
  availableSizes: ProductSize[];
  stock: number;
  saleType?: 'SALE' | 'FLASH_SALE' | null;
  discountPercentage?: number;
  video?: string;
  videos?: string[];
}

export const mockProducts: Product[] = [
  {
    id: "p-01",
    sku: "LGT-CLS-001",
    name: { 
      vi: "Toad - Vương Quốc Nấm Cổ Điển", 
      en: "Toad - Classic Mushroom Kingdom" 
    },
    category: "Classic",
    price: 83.99, // original 139.99
    rating: 4.8,
    reviews: 128,
    likes: 3400,
    estimatedPrintTime: "2-4 days",
    images: ["/images/toad-transparent.png"],
    description: {
      vi: "Mô hình Toad cổ điển từ vũ trụ Super Mario, được chế tác tinh xảo với độ hoàn thiện cực cao. Phù hợp để trang trí bàn làm việc hoặc bộ sưu tập game.",
      en: "Classic Toad model from the Super Mario universe, exquisitely crafted with high finish. Perfect for desk decoration or gaming collection."
    },
    availableSizes: ['Size 300', 'Size 400', 'Size 1000'],
    stock: 12,
    saleType: 'FLASH_SALE',
    discountPercentage: 25,
    video: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: "p-02",
    sku: "LGT-SUP-001",
    name: { 
      vi: "Deadpool - Kẻ Đánh Thuê Lắm Mồm", 
      en: "Deadpool - Merc with a Mouth" 
    },
    category: "Superheroes",
    price: 119.99, // original 199.99
    rating: 4.9,
    reviews: 210,
    likes: 5600,
    estimatedPrintTime: "2-3 days",
    images: ["/images/deadpool-transparent.png"],
    description: {
      vi: "Anh chàng bựa nhân được yêu thích nhất. Hoàn thiện với sắc đỏ rực rỡ và những chi tiết vũ khí được in 3D cực kỳ sắc nét.",
      en: "Everyone's favorite anti-hero. Finished in vibrant red with incredibly sharp 3D printed weapon details."
    },
    availableSizes: ["Size 400", "Size 1000"],
    stock: 8,
    saleType: 'FLASH_SALE',
    discountPercentage: 50
  },
  {
    id: "p-03",
    sku: "LGT-SUP-002",
    name: { 
      vi: "Venom - Cơn Ác Mộng Symbiote", 
      en: "Venom - Symbiote Nightmare" 
    },
    category: "Superheroes",
    price: 131.99, // original 219.99
    rating: 5.0,
    reviews: 320,
    likes: 8900,
    estimatedPrintTime: "3-5 days",
    images: ["/images/venom-transparent.png"],
    description: {
      vi: "Nắm lấy sức mạnh symbiote. Nổi bật với miệng và biểu tượng nhện vô cùng chi tiết, tăng cường với lớp phủ bóng tối tinh xảo.",
      en: "Embrace the symbiote. Features an incredibly detailed mouth and spider emblem, enhanced with our glossy dark finish."
    },
    availableSizes: ["Size 300", "Size 400", "Size 1000"],
    stock: 5,
  },
  {
    id: "p-04",
    sku: "LGT-CLS-002",
    name: { 
      vi: "Ông Già Noel - Mùa Giáng Sinh LEGATO", 
      en: "Santa Claus - LEGATO Christmas Edition" 
    },
    category: "Classic",
    price: 95.99, // original 159.99
    rating: 4.9,
    reviews: 145,
    likes: 4200,
    estimatedPrintTime: "2-4 days",
    images: ["/images/santa-transparent.png"],
    description: {
      vi: "Mang không khí Giáng Sinh ấm áp vào ngôi nhà của bạn với nhân vật Ông Già Noel LEGATO đặc biệt. Từng chi tiết nhỏ đều được hoàn thiện bằng liquid glass.",
      en: "Bring the warm Christmas spirit into your home with our special LEGATO Santa Claus figure. Every tiny detail is finished with liquid glass."
    },
    availableSizes: ["Size 300", "Size 400", "Size 1000"],
    stock: 10,
  },
  {
    id: "p-05",
    sku: "LGT-SUP-003",
    name: { 
      vi: "Báo Đen - Wakanda Bất Diệt", 
      en: "Black Panther - Wakanda Forever" 
    },
    category: "Superheroes",
    price: 143.99, // original 239.99
    rating: 5.0,
    reviews: 410,
    likes: 9800,
    estimatedPrintTime: "3-5 days",
    images: ["/images/black-panther-transparent.png"],
    description: {
      vi: "Vị vua của Wakanda đã xuất hiện dưới hình dáng cực ngầu. Nổi bật với lớp sơn mờ đen huyền bí kết hợp cùng các chi tiết bạc rực rỡ.",
      en: "The king of Wakanda has arrived in an ultra-cool form. Features a mysterious matte black finish combined with brilliant silver details."
    },
    availableSizes: ["Size 300", "Size 400", "Size 1000"],
    stock: 3,
  }
];

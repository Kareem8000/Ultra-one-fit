export interface ProductPiece {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  price: number;
  category: 'tshirt' | 'jeans' | 'shoes';
  details: string;
  sizes: string[];
  fabric?: string;
  fit?: string;
  design?: string;
  additionalDetails?: string[];
  description?: string;
  catalogProductId?: string;
  image?: string;
  availableColors?: ColorSwatchOption[];
}

export interface ColorSwatchOption {
  name: string;
  hex: string;
  note?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  type: string;
  fabric: string;
  fabricComposition?: string;
  fit: string;
  design?: string;
  colors: string[];
  colorOptions: ColorSwatchOption[];
  sizes: string[];
  sizeDetails?: string;
  sizeWeights?: Record<string, string>;
  additionalDetails?: string[];
  description: string;
  colorNotes?: string;
  price: number;
  warranty?: string;
  image: string;
  gallery?: string[];
  colorGalleries?: Record<string, string[]>;
  cardShortCopy: string;
  cardFitDetail: string;
}

export interface CartItem {
  id: string; // unique key: `${productId}-${color}-${size}`
  productId: string;
  productName: string;
  productType: string;
  productCategory?: string;
  selectedColor: string;
  selectedColorHex?: string;
  selectedSize: string;
  quantity: number;
  price: number;
  image: string;
  warranty?: string;
  outfitName?: string;
  outfitId?: string;
  bundleId?: string;
  isLookPiece?: boolean;
  lookPrice?: number;
  lookSeparatePrice?: number;
  lookSavings?: number;
}

export interface Outfit {
  id: string;
  slug?: string;
  number: string;
  name: string;
  nameEn: string;
  occasion: string;
  occasionTag: string;
  message: string;
  headline?: string;
  context?: string;
  descriptionText?: string;
  description?: string;
  story?: string;
  image: string;
  galleryImages?: string[];
  pieces: ProductPiece[];
  totalPrice: number;
  separatePrice: number;
  savingsAmount: number;
  recommendedLookIds?: string[];
}

export interface ModelMeasurements {
  height: string;
  weight: string;
  tshirtSize: string;
  jeansSize: string;
  shoesSize: string;
  chest: string;
  waist: string;
  build: string;
  note: string;
}

export interface FaqItem {
  id: number;
  num?: string;
  question: string;
  answer: string | string[];
}

export interface OrderDetails {
  outfit: Outfit;
  selectedSizes: {
    tshirt: string;
    jeans: string;
    shoes: string;
  };
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  paymentMethod: 'cod';
  subtotal: number;
  shippingFee: number;
  total: number;
}

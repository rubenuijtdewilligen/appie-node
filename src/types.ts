export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export interface PosReceiptsPageData {
  posReceiptsPage: {
    posReceipts: Array<{
      id: string;
      dateTime: string;
      totalAmount: {
        amount: number;
      };
    }>;
  };
}

export interface PosReceiptDetailsData {
  posReceiptDetails: {
    id: string;
    products: Array<{
      id: number;
      quantity: number;
      name: string;
      price?: {
        amount: number;
      };
      amount: {
        amount: number;
      };
    }>;
    discounts: Array<{
      name: string;
      amount: {
        amount: number;
      };
    }>;
    payments: Array<{
      method: string;
      amount: {
        amount: number;
      };
    }>;
  };
}

export interface ProductDetailResponse {
  productId: number;
  productCard: ProductCard;
  properties?: Record<string, string[]>;
  tradeItem?: any;
  disclaimerText?: string;
}

export interface ProductCard {
  webshopId: number;
  hqId: number;
  title: string;
  salesUnitSize?: string;
  unitPriceDescription?: string;
  images?: Array<{ width: number; height: number; url: string }>;
  currentPrice?: number | null;
  priceBeforeBonus?: number;
  orderAvailabilityStatus?: string;
  mainCategory?: string;
  subCategory?: string;
  brand?: string;
  shopType?: string;
  availableOnline?: boolean;
  isPreviouslyBought?: boolean;
  descriptionHighlights?: string;
  descriptionFull?: string;
  propertyIcons?: string[];
  nutriscore?: string;
  nix18?: boolean;
  isBonus?: boolean;
  isOrderable?: boolean;
  isSample?: boolean;
  isSponsored?: boolean;
  isVirtualBundle?: boolean;
  bonusMechanism?: string | null;
  discountLabels?: Array<{
    code: string;
    defaultDescription: string;
    percentage?: number;
    price?: number;
  }>;
  [key: string]: any;
}

export interface Nutrient {
  type: string;
  name: string;
  value: string;
}

export interface GraphQLProductData {
  product: {
    id: number;
    tradeItem?: {
      nutritions?: Array<{
        nutrients: Array<Nutrient>;
      }>;
    };
  };
}

export interface MemberProfileData {
  member: {
    id: string | number;
    emailAddress?: string;
    gender?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    isB2B?: boolean;
    name?: {
      first: string;
      last: string;
    };
    address?: {
      street: string;
      houseNumber: number | string;
      houseNumberExtra?: string;
      postalCode: string;
      city: string;
      countryCode: string;
    };
    cards?: {
      bonus?: string | null;
      gall?: string | null;
      airmiles?: string | null;
    };
    customerProfileAudiences?: string[];
  };
}

export interface KoopzegelsBalanceData {
  purchaseStampBalance: {
    points: {
      currentBookletPoints: number;
      fullBooklets: number;
      totalPoints: number;
    };
    money: {
      invested: { amount: number };
      interest: { amount: number };
      payout: { amount: number };
    };
  };
  purchaseStampSavingGoal?: {
    target: string;
  };
}

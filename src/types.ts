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

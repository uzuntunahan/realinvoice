export interface User {
  userId: number;
  userName: string;
  role: string;
}

export interface LoginResponse {
  userId: number;
  userName: string;
  role: string;
  success: boolean;
}

export interface InvoiceLine {
  itemName: string;
  quantity: number;
  price: number;
  userId: number;
}

export interface InvoiceSavePayload {
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: number;
  customerId: number;
  userId: number;
  invoiceLines: InvoiceLine[];
}

export interface InvoiceUpdatePayload {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: number;
}

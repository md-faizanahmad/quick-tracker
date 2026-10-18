export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SAR";

export interface Currency {
  code: CurrencyCode;
  locale: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  hsn?: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: string; // UUID (edit/delete)
  invoiceNumber: string; // 2025-GST-0007
  type: "GST" | "NON_GST";
  currency: Currency;

  seller: {
    name: string;
    address: string;
    gstin?: string;
  };

  customer: {
    name: string;
    address: string;
    gstin?: string;
  };

  items: InvoiceItem[];

  totals: {
    subtotal: number;
    tax?: number;
    total: number;
  };

  qrEnabled: boolean;
  createdAt: number;
}

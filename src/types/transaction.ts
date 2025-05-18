export interface TransactionResponse {
    invoice_number: string;
    service_code: string;
    service_name: string;
    transaction_type: string;
    total_amount: number;
    created_on: string;
}

export interface TransactionRecord {
  invoice_number: string;
  transaction_type: "TOPUP" | "PAYMENT";
  description: string;
  total_amount: number;
  created_on: string;
}

export interface TransactionHistoryResponse {
  offset: number;
  limit: number;
  records: TransactionRecord[];
}
import { InvoiceSavePayload, InvoiceUpdatePayload } from '../types';

const BASE_URL = 'http://localhost:8080/api/invoices';

export const invoiceService = {
  list: async (userId: number, role: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/list?userId=${userId}&role=${role}`);
    const data = await response.json();
    
    // Eğer gelen veri bir dizi ise, sadece içi dolu olan nesneleri süz
    if (Array.isArray(data)) {
      return data.filter(invoice => invoice !== null && invoice !== undefined);
    }
    return [];
  },


  save: async (payload: InvoiceSavePayload): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  },

  update: async (payload: InvoiceUpdatePayload): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  },

  delete: async (invoiceId: number): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/delete/${invoiceId}`, {
      method: 'DELETE',
    });
    return response.ok;
  }
};

'use client';

import { useState, useEffect } from 'react';

interface InvoiceFormProps {
  isEditing: boolean;
  initialData: any;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

export default function InvoiceForm({ isEditing, initialData, onSubmit, onCancel }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    itemName: '',
    quantity: 1,
    price: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ invoiceNumber: '', itemName: '', quantity: 1, price: 0 });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e4e4e7' }}>
      <h2>{isEditing ? 'Faturayı Düzenle' : 'Yeni Fatura Oluştur'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
        <label>Fatura Numarası:</label>
        <input type="text" value={formData.invoiceNumber} required style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} />

        {!isEditing && (
          <>
            <label>Ürün Adı:</label>
            <input type="text" value={formData.itemName} required style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Adet:</label>
                <input type="number" value={formData.quantity} min="1" required style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Birim Fiyat:</label>
                <input type="number" value={formData.price || ''} required style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
              </div>
            </div>
          </>
        )}

        {isEditing && (
          <>
            <label>Toplam Tutar Güncelleme (TL):</label>
            <input type="number" value={formData.price || ''} required style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
          </>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 2, padding: '10px', backgroundColor: isEditing ? '#eab308' : '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isEditing ? 'Değişiklikleri Kaydet' : 'Faturayı Kaydet'}
          </button>
          {isEditing && <button type="button" onClick={onCancel} style={{ flex: 1, padding: '10px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>İptal</button>}
        </div>
      </form>
    </div>
  );
}

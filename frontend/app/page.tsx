'use client';

import { useState, useEffect } from 'react';
import { User } from '../src/types';
import { invoiceService } from '../src/services/invoiceService';
import LoginForm from '../src/components/LoginForm';
import InvoiceList from '../src/components/InvoiceList';
import InvoiceForm from '../src/components/InvoiceForm';

export default function FaturaUygulamasi() {
  const [user, setUser] = useState<User | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  
  // Formun temizlenmesi ve veri akışı için state yapısı
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<any>({
    invoiceNumber: '',
    itemName: '',
    quantity: 1,
    price: 0
  });

  useEffect(() => {
    const savedUser = sessionStorage.getItem('logged_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadInvoices(parsedUser.userId, parsedUser.role); //  Giriş yapan kullanıcının eski tüm faturalarını veritabanından yükler
    }
  }, []);

  // Veritabanından faturaları çeken servis fonksiyonu
  const loadInvoices = async (userId: number, role: string) => {
    setLoading(true);
    try {
      const data = await invoiceService.list(userId, role);
      setInvoices(data); // Eski ve yeni tüm faturalar bu state'e doluyor
    } catch (error) {
      console.error('Faturalar yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: User) => {
    sessionStorage.setItem('logged_user', JSON.stringify(userData));
    setUser(userData);
    loadInvoices(userData.userId, userData.role); // İlk girişte eski faturaları tetikler
  };

  // --- FORM SUBMIT (KAYDETME & GÜNCELLEME) ---
  const handleFormSubmit = async (formFields: any) => {
    if (!user) return;
    const total = formFields.quantity * formFields.price;

    if (isEditing && editingInvoiceId) {
      // PUT Güncelleme Aksiyonu
      const success = await invoiceService.update({
        invoiceId: editingInvoiceId,
        invoiceNumber: formFields.invoiceNumber,
        invoiceDate: new Date().toISOString(),
        totalAmount: formFields.price
      });
      if (success) {
        alert('Fatura başarıyla güncellendi!');
        handleCancelEdit();
        loadInvoices(user.userId, user.role); // Re-fetch: Listeyi anında tazele
      }
    } else {
      // POST Yeni Fatura Kaydetme Aksiyonu
      const success = await invoiceService.save({
        invoiceNumber: formFields.invoiceNumber,
        invoiceDate: new Date().toISOString(),
        totalAmount: total,
        customerId: 5, // Test için sabit müşteri ID'si
        userId: user.userId,
        invoiceLines: [{ itemName: formFields.itemName, quantity: formFields.quantity, price: formFields.price, userId: user.userId }]
      });
      
      if (success) {
        alert('Yeni fatura başarıyla kaydedildi!');
        // Form input alanlarını temizle ve state'i sıfırla
        setSelectedInvoiceData({ invoiceNumber: '', itemName: '', quantity: 1, price: 0 }); 
        loadInvoices(user.userId, user.role); // Re-fetch: Listeyi anında tazele, yeni faturayı tabloda göster
      }
    }
  };

  const handleStartEdit = (invoice: any) => {
    setIsEditing(true);
    setEditingInvoiceId(invoice.invoiceId);
    setSelectedInvoiceData({
      invoiceNumber: invoice.invoiceNumber,
      itemName: '',
      quantity: 1,
      price: invoice.totalAmount
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingInvoiceId(null);
    setSelectedInvoiceData({ invoiceNumber: '', itemName: '', quantity: 1, price: 0 });
  };

  const handleDelete = async (id: number) => {
    if (!user || !confirm('Bu faturayı veritabanından silmek istediğinize emin misiniz?')) return;
    const success = await invoiceService.delete(id);
    if (success) {
      alert('Fatura silindi!');
      loadInvoices(user.userId, user.role); // Re-fetch: Silme sonrası listeyi tazele
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('logged_user');
    setUser(null);
    setInvoices([]);
  };

  if (!user) return <LoginForm onLoginSuccess={handleLoginSuccess} />;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e4e4e7', paddingBottom: '15px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Kurumsal Fatura Paneli (Architecture V2)</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Kullanıcı: <b>{user.userName}</b> | Rol: <b>{user.role}</b></p>
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Çıkış</button>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 2 }}>
          {/* Sol tarafta eski ve yeni tüm faturalar anlık listelenir */}
          <InvoiceList invoices={invoices} loading={loading} onEdit={handleStartEdit} onDelete={handleDelete} />
        </div>
        <div style={{ flex: 1 }}>
          <InvoiceForm isEditing={isEditing} initialData={selectedInvoiceData} onSubmit={handleFormSubmit} onCancel={handleCancelEdit} />
        </div>
      </div>
    </div>
  );
}

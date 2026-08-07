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
  
  // Form temizliği ve veri taşınması için state
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<any>({
    invoiceNumber: '',
    itemName: '',
    quantity: 1,
    price: 0
  });

  // Modal (Detay) penceremizin durumları
  const [activeInvoiceDetails, setActiveInvoiceDetails] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('logged_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadInvoices(parsedUser.userId, parsedUser.role);
    }
  }, []);

  const loadInvoices = async (userId: number, role: string) => {
    setLoading(true);
    try {
      const data = await invoiceService.list(userId, role);
      setInvoices(data);
    } catch (error) {
      console.error('Faturalar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: User) => {
    sessionStorage.setItem('logged_user', JSON.stringify(userData));
    setUser(userData);
    loadInvoices(userData.userId, userData.role);
  };

  const handleFormSubmit = async (formFields: any) => {
    if (!user) return;
    const total = formFields.quantity * formFields.price;

    if (isEditing && editingInvoiceId) {
      // --- PUT: Fatura Güncelleme Aksiyonu ---
      const success = await invoiceService.update({
        invoiceId: editingInvoiceId,
        invoiceNumber: formFields.invoiceNumber,
        invoiceDate: new Date().toISOString(),
        totalAmount: formFields.price
      });
      if (success) {
        alert('Fatura başarıyla güncellendi!');
        handleCancelEdit();
        loadInvoices(user.userId, user.role);
      }
    } else {
      // --- POST: Yeni Fatura Kaydetme Aksiyonu ---
      // ⚡ Müşteri ve User aynı kişi olduğu için ikisine de giriş yapan kişinin ID'sini gömüyoruz
      const success = await invoiceService.save({
        invoiceNumber: formFields.invoiceNumber,
        invoiceDate: new Date().toISOString(),
        totalAmount: total,
        customerId: user.userId, // Arka planda otomatik eşleşti
        userId: user.userId,     // Arka planda otomatik eşleşti
        invoiceLines: [
          {
            itemName: formFields.itemName,
            quantity: formFields.quantity, // Veritabanındaki 'Quantity' alanına tam uyumlu
            price: formFields.price,
            userId: user.userId
          }
        ]
      });
      
      if (success) {
        alert('Fatura veritabanına başarıyla kaydedildi!');
        setSelectedInvoiceData({ invoiceNumber: '', itemName: '', quantity: 1, price: 0 }); // Formu temizle
        loadInvoices(user.userId, user.role); // Listeyi anında yenile
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

  const handleOpenDetails = (invoice: any) => {
    setActiveInvoiceDetails(invoice);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingInvoiceId(null);
    setSelectedInvoiceData({ invoiceNumber: '', itemName: '', quantity: 1, price: 0 });
  };

  const handleDelete = async (id: number) => {
    if (!user || !confirm('Bu faturayı silmek istediğinize emin misiniz?')) return;
    const success = await invoiceService.delete(id);
    if (success) {
      alert('Fatura silindi!');
      loadInvoices(user.userId, user.role);
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
      {/* ÜST BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e4e4e7', paddingBottom: '15px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Kurumsal Fatura Paneli</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Giriş Yapan Kullanıcı: <b>{user.userName}</b> | Rol: <b>{user.role}</b></p>
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Çıkış</button>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* SOL TARAF: LİSTELEME */}
        <div style={{ flex: 2 }}>
          <InvoiceList invoices={invoices} loading={loading} onEdit={handleStartEdit} onDelete={handleDelete} onViewDetails={handleOpenDetails} />
        </div>
        {/* SAĞ TARAF: FORM */}
        <div style={{ flex: 1 }}>
          <InvoiceForm isEditing={isEditing} initialData={selectedInvoiceData} onSubmit={handleFormSubmit} onCancel={handleCancelEdit} />
        </div>
      </div>

      {/* DETAY PENCERESİ (MODAL) */}
      {isModalOpen && activeInvoiceDetails && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Fatura Kalem Detayı: {activeInvoiceDetails.invoiceNumber}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
            </div>
            
            <p><b>Müşteri Unvanı:</b> {activeInvoiceDetails.customerTitle || 'Belirtilmemiş'}</p>
            <p><b>Fatura Tarihi:</b> {activeInvoiceDetails.invoiceDate ? new Date(activeInvoiceDetails.invoiceDate).toLocaleString('tr-TR') : '-'}</p>
            <p><b>Toplam Tutar:</b> {activeInvoiceDetails.totalAmount} TL</p>
            
            <h4 style={{ marginTop: '20px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Fatura Kalemleri (dbo.invoice_lines)</h4>
            
            {activeInvoiceDetails.invoiceLines && activeInvoiceDetails.invoiceLines.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f4f4f5', textAlign: 'left' }}>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Ürün/Hizmet</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Adet</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Birim Fiyat</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvoiceDetails.invoiceLines.map((line: any, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{line.itemName || line.ItemName || '-'}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{line.quentity || line.Quentity || line.quantity || 0}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {Math.round((activeInvoiceDetails.totalAmount / (line.quentity || line.Quentity || line.quantity || 1)))} TL
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#888', fontSize: '14px' }}>Bu faturaya ait alt ürün kalemi bulunamadı.</p>
            )}

            <button onClick={() => setIsModalOpen(false)} style={{ marginTop: '25px', width: '100%', padding: '10px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}

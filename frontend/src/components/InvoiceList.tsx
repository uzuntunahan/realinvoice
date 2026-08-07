'use client';

interface InvoiceListProps {
  invoices: any[];
  loading: boolean;
  onEdit: (invoice: any) => void;
  onDelete: (id: number) => void;
  onViewDetails: (invoice: any) => void;
}

export default function InvoiceList({ invoices, loading, onEdit, onDelete, onViewDetails }: InvoiceListProps) {
  if (loading) return <p>Faturalar yükleniyor...</p>;
  if (invoices.length === 0) return <p style={{ color: '#888' }}>Henüz fatura kaydı bulunamadı.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f4f4f5', textAlign: 'left', borderBottom: '2px solid #e4e4e7' }}>
          <th style={{ padding: '12px' }}>Fatura No</th>
          <th style={{ padding: '12px' }}>Müşteri Unvanı</th>
          <th style={{ padding: '12px' }}>Toplam Tutar</th>
          <th style={{ padding: '12px' }}>Tarih</th>
          <th style={{ padding: '12px', textAlign: 'center' }}>Aksiyonlar</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice, index) => (
          <tr key={invoice.invoiceId || index} style={{ borderBottom: '1px solid #e4e4e7' }}>
            <td style={{ padding: '12px' }}>{invoice.invoiceNumber}</td>
            <td style={{ padding: '12px' }}>{invoice.customerTitle || 'Belirtilmemiş'}</td>
            <td style={{ padding: '12px' }}>{invoice.totalAmount} TL</td>
            <td style={{ padding: '12px' }}>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('tr-TR') : '-'}</td>
            <td style={{ padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={() => onViewDetails(invoice)} style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Detay</button>
              <button onClick={() => onEdit(invoice)} style={{ padding: '6px 12px', backgroundColor: '#eab308', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Düzenle</button>
              <button onClick={() => onDelete(invoice.invoiceId)} style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sil</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const metadata = {
  title: 'Kurumsal Fatura Yönetim Paneli',
  description: 'Spring Boot + Next.js Staj Projesi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, backgroundColor: '#f3f4f6' }}>
        {/* Tüm sayfalarımız ve bileşenlerimiz otomatik olarak bu children alanına yerleşecek */}
        {children}
      </body>
    </html>
  );
}

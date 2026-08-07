# Kurumsal Fatura Yönetim Sistemi (Invoice Management System)

Bu proje, bir staj görevi kapsamında geliştirilmiş; katmanlı mimari (Layered Architecture) prensiplerine uygun, rol tabanlı yetkilendirme barındıran tam donanımlı bir Fatura Yönetim Sistemi uygulamasıdır. Backend tarafı Spring Boot ve Microsoft SQL Server (MSSQL) ile inşa edilmiş, ön yüz mimarisi ise Next.js ve Bootstrap kullanılarak tasarlanmıştır.

## 🏗️ Proje Mimarisi ve Klasör Yapısı

Proje, tek bir depo (Monorepo) içerisinde backend ve frontend katmanlarını bağımsız olarak barındırmaktadır:

```text
realinvoice (Repository Root)
  ├── src/main/java/com/megudacorp/realinvoice/
  │     ├── business/      # İş kuralları, servisler (Abstracts/Concretes) ve DTO'lar
  │     ├── core/          # ModelMapper konfigürasyonu ve ortak yardımcı araçlar
  │     ├── dataAccess/    # Spring Data JPA Veritabanı sorgu katmanları (Repositories)
  │     ├── entities/      # MSSQL Veritabanı somut nesneleri (User, Customer, Invoice, InvoiceLine)
  │     └── webApi/        # REST Controller API uç noktaları (Auth, Invoices)
  ├── frontend/            # Next.js App Router ön yüz kaynak kodları
  ├── pom.xml              # Maven bağımlılık yönetim dosyası
  └── .gitignore           # Git versiyon kontrol kısıtlama dosyası
```

## 🚀 Teknik Özellikler ve Endpoint Sözleşmesi

### 1. Kimlik Doğrulama Katmanı (Auth)
* **POST** `/api/auth/login`: Kullanıcı adı ve şifre doğrulaması yapar. Başarılı girişte `userId` ve sistemdeki `role` ("ADMIN" veya "USER") bilgisini geri döner. Ön yüz bu veriyi `localStorage` üzerinde güvenli bir şekilde taşır.

### 2. Fatura Yönetim Katmanı (Invoices - CRUD)
* **POST** `/api/invoices/save`: Yeni fatura ve faturaya bağlı alt kalemleri (InvoiceLines) ilişkisel kurallara uygun olarak MSSQL'e kaydeder.
* **GET** `/api/invoices/list`: Tarih aralığı filtresini destekler. `USER` rolündeki kullanıcılar sadece kendilerine ait faturaları listelerken, `ADMIN` rolündeki kullanıcılar tüm sistem faturalarını denetleyebilir.
* **PUT** `/api/invoices/update`: Mevcut bir faturanın numarasını, tarihini veya tutarını; veritabanındaki kayıt tarihlerini ve müşteri ilişkilerini bozmadan güvenli bir şekilde günceller.
* **DELETE** `/api/invoices/delete/{id}`: Kurumsal veri kaybını önlemek adına faturayı fiziksel olarak silmez. İlgili faturayı "DELETED" bayrağıyla işaretleyerek pasife çeker (Soft Delete). Pasif faturalar normal kullanıcılardan gizlenirken sadece admin panelinde arşiv olarak listelenir.

## 🛠️ Kurulum ve Çalıştırma

### Backend Dağıtımı (Spring Boot)
1. `src/main/resources/application.properties` dosyası içerisindeki yerel MSSQL bağlantı adresini (`spring.datasource.url`) ve `sa` şifrenizi güncelleyin.
2. Microsoft SQL Server üzerinde `InvoiceDb` adında boş bir veritabanı oluşturun ve `SQL Server Configuration Manager` üzerinden TCP/IP 1433 portunun aktif olduğunu doğrulayın.
3. Projenin ana dizininde terminali açarak uygulamayı derleyin ve çalıştırın:
   ```bash
   mvn clean spring-boot:run
   ```
4. API uç noktalarını canlı test etmek için tarayıcınızdan Swagger arayüzüne erişebilirsiniz: `http://localhost:8080/swagger-ui/index.html`

### Frontend Dağıtımı (Next.js)
1. `frontend` klasörünün içerisine girerek gerekli paketleri yükleyin:
   ```bash
   cd frontend
   npm install
   ```
2. Uygulamayı yerel geliştirme modunda ayağa kaldırın:
   ```bash
   npm run dev
   ```
3. Tarayıcınız üzerinden `http://localhost:3000` adresine giderek kullanıcı paneline erişebilirsiniz.

### 🔐 Test Kullanıcı Bilgileri
* **Normal Kullanıcı Paneli:** `ahmet` / `123` (Yalnızca kendi kestiği aktif faturaları görür).
* **Yönetici (Admin) Paneli:** `admin` / `123` (Tüm faturaları ve silinen kayıtları görüntüleyebilir).

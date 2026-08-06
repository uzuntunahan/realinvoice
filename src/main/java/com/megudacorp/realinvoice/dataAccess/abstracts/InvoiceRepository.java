package com.megudacorp.realinvoice.dataAccess.abstracts;

import org.springframework.data.jpa.repository.JpaRepository;
import com.megudacorp.realinvoice.entities.concretes.Invoice;
import java.time.LocalDateTime;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    // İki tarih arasındaki faturaları otomatik getirir
    List<Invoice> findByInvoiceDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Invoice> findTop100ByOrderByInvoiceDateDesc();
    // Sadece belirli bir kullanıcının iki tarih arasındaki faturalarını getirir
    List<Invoice> findByUser_UserIdAndInvoiceDateBetween(int userId, LocalDateTime startDate, LocalDateTime endDate);
}
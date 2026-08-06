package com.megudacorp.realinvoice.business.requests;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateInvoiceRequest {
    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private double totalAmount;
    private int customerId; // İlişkili müşteri ID'si
    private int userId;     // İşlemi yapan kullanıcı ID'si
    private List<CreateInvoiceLineRequest> invoiceLines;
}

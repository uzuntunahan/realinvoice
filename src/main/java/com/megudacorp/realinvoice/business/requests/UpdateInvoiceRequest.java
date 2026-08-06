package com.megudacorp.realinvoice.business.requests;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UpdateInvoiceRequest {
    private int invoiceId; // Güncellenecek faturanın ID'si
    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private double totalAmount;
}

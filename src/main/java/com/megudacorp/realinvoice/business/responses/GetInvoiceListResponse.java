package com.megudacorp.realinvoice.business.responses;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GetInvoiceListResponse {
    private int invoiceId;
    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private double totalAmount;
    private String customerTitle; // Müşterinin sadece adını dönmek dış dünya için yeterlidir
}

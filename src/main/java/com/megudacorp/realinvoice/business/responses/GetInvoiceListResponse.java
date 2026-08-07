package com.megudacorp.realinvoice.business.responses;

import com.megudacorp.realinvoice.business.requests.CreateInvoiceLineRequest;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class GetInvoiceListResponse {
    private int invoiceId;
    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private double totalAmount;
    private String customerTitle;
    private List<CreateInvoiceLineRequest> invoiceLines;
}

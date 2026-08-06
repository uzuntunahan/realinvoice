package com.megudacorp.realinvoice.business.abstracts;

import com.megudacorp.realinvoice.business.requests.CreateInvoiceRequest;
import com.megudacorp.realinvoice.business.requests.UpdateInvoiceRequest;
import com.megudacorp.realinvoice.business.responses.GetInvoiceListResponse;
import java.time.LocalDateTime;
import java.util.List;

public interface InvoiceService {
    void add(CreateInvoiceRequest createInvoiceRequest);
    void update(UpdateInvoiceRequest updateInvoiceRequest);
    void delete(int id);

    List<GetInvoiceListResponse> getInvoiceList(int userId, String role, LocalDateTime startDate, LocalDateTime endDate);
}

package com.megudacorp.realinvoice.business.concretes;

import com.megudacorp.realinvoice.business.requests.CreateInvoiceLineRequest;
import com.megudacorp.realinvoice.entities.concretes.InvoiceLine;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import com.megudacorp.realinvoice.business.abstracts.InvoiceService;
import com.megudacorp.realinvoice.business.requests.CreateInvoiceRequest;
import com.megudacorp.realinvoice.business.requests.UpdateInvoiceRequest;
import com.megudacorp.realinvoice.business.responses.GetInvoiceListResponse;
import com.megudacorp.realinvoice.core.mappers.abstracts.ModelMapperService;
import com.megudacorp.realinvoice.dataAccess.abstracts.InvoiceRepository;
import com.megudacorp.realinvoice.entities.concretes.Invoice;
import com.megudacorp.realinvoice.entities.concretes.User;
import com.megudacorp.realinvoice.entities.concretes.Customer;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InvoiceManager implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ModelMapperService modelMapperService;

    @Override
    public void add(CreateInvoiceRequest createInvoiceRequest) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(createInvoiceRequest.getInvoiceNumber());
        invoice.setInvoiceDate(createInvoiceRequest.getInvoiceDate());
        invoice.setTotalAmount(createInvoiceRequest.getTotalAmount());
        invoice.setRecordDate(LocalDateTime.now());

        Customer customer = new Customer();
        customer.setCustomerId(createInvoiceRequest.getCustomerId());
        invoice.setCustomer(customer);

        User user = new User();
        user.setUserId(createInvoiceRequest.getUserId());
        invoice.setUser(user);

        // Alt kalemleri bağlama döngüsü
        if (createInvoiceRequest.getInvoiceLines() != null) {
            List<InvoiceLine> lines = new ArrayList<>();
            for (CreateInvoiceLineRequest lineRequest : createInvoiceRequest.getInvoiceLines()) {
                InvoiceLine line = new InvoiceLine();
                line.setItemName(lineRequest.getItemName());
                line.setQuantity(lineRequest.getQuantity());
                line.setPrice(lineRequest.getPrice());
                line.setRecordDate(LocalDateTime.now());
                line.setInvoice(invoice);
                line.setUser(user);
                lines.add(line);
            }
            invoice.setInvoiceLines(lines);
        }

        this.invoiceRepository.save(invoice);
    }


    @Override
    public void update(UpdateInvoiceRequest updateInvoiceRequest) {

        Invoice existingInvoice = this.invoiceRepository.findById(updateInvoiceRequest.getInvoiceId()).orElseThrow();
        existingInvoice.setInvoiceNumber(updateInvoiceRequest.getInvoiceNumber());
        existingInvoice.setInvoiceDate(updateInvoiceRequest.getInvoiceDate());
        existingInvoice.setTotalAmount(updateInvoiceRequest.getTotalAmount());
        // Null koruması
        existingInvoice.setCustomer(existingInvoice.getCustomer());
        existingInvoice.setUser(existingInvoice.getUser());
        existingInvoice.setRecordDate(existingInvoice.getRecordDate());
        this.invoiceRepository.save(existingInvoice);
    }

    @Override
    public void delete(int id) {
        Invoice invoice = this.invoiceRepository.findById(id).orElseThrow();
        if (invoice.getInvoiceNumber().startsWith("DELETED -") ||
                invoice.getInvoiceNumber().startsWith("SİLİNDİ -")) {
            return;
        }
        invoice.setInvoiceNumber("DELETED - " + invoice.getInvoiceNumber());
        this.invoiceRepository.save(invoice);
    }


    @Override
    public List<GetInvoiceListResponse> getInvoiceList(int userId, String role, LocalDateTime startDate, LocalDateTime endDate) {
        List<Invoice> invoices;
        if (startDate == null) {
            startDate = LocalDateTime.now().minusYears(10);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now().plusYears(10);
        }

        // Yetki kontrolüne göre veritabanından çekme
        if (role != null && role.equalsIgnoreCase("ADMIN")) {
            invoices = this.invoiceRepository.findByInvoiceDateBetween(startDate, endDate);
        } else {
            invoices = this.invoiceRepository.findByUser_UserIdAndInvoiceDateBetween(userId, startDate, endDate);
        }

        // DTO Dönüşümü ve NULL Güvenlik Duvarı
        return invoices.stream()
                .map(invoice -> {
                    if (invoice.getUser() == null || invoice.getCustomer() == null) {
                        return null;
                    }

                    GetInvoiceListResponse response = this.modelMapperService.forResponse()
                            .map(invoice, GetInvoiceListResponse.class);

                    response.setCustomerTitle(invoice.getCustomer().getTitle());

                    // Faturaya bağlı alt kalemleri tek tek response DTO'sunun içine dolduruyoruz
                    if (invoice.getInvoiceLines() != null) {
                        List<CreateInvoiceLineRequest> lineRequests = invoice.getInvoiceLines().stream().map(line -> {
                            CreateInvoiceLineRequest lineRequest = new CreateInvoiceLineRequest();
                            lineRequest.setItemName(line.getItemName());
                            lineRequest.setQuantity(line.getQuantity());
                            lineRequest.setPrice(line.getPrice());
                            lineRequest.setUserId(line.getUser().getUserId());
                            return lineRequest;
                        }).collect(Collectors.toList());

                        response.setInvoiceLines(lineRequests);
                    }

                    return response;
                })
                .filter(Objects::nonNull)
                .filter(response -> {
                    if (role != null && role.equalsIgnoreCase("ADMIN")) {
                        return true;
                    }
                    return !response.getInvoiceNumber().startsWith("DELETED");
                })
                .collect(Collectors.toList());
    }

}

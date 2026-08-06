package com.megudacorp.realinvoice.webApi.controllers;

import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import com.megudacorp.realinvoice.business.abstracts.InvoiceService;
import com.megudacorp.realinvoice.business.requests.CreateInvoiceRequest;
import com.megudacorp.realinvoice.business.requests.UpdateInvoiceRequest;
import com.megudacorp.realinvoice.business.responses.GetInvoiceListResponse;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class InvoicesController {

    private final InvoiceService invoiceService;

    @PostMapping("/save")
    public void add(@RequestBody CreateInvoiceRequest createInvoiceRequest) {
        this.invoiceService.add(createInvoiceRequest);
    }

    @PutMapping("/update")
    public void update(@RequestBody UpdateInvoiceRequest updateInvoiceRequest) {
        this.invoiceService.update(updateInvoiceRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable int id) {
        this.invoiceService.delete(id);
    }

    @GetMapping("/list")
    public List<GetInvoiceListResponse> getInvoiceList(
            @RequestParam(name = "userId") int userId,
            @RequestParam(name = "role") String role,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return this.invoiceService.getInvoiceList(userId, role, startDate, endDate);
    }
}

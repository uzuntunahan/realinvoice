package com.megudacorp.realinvoice.business.requests;

import lombok.Data;

@Data
public class CreateInvoiceLineRequest {
    private String itemName;
    private int quantity;
    private double price;
    private int userId;
}

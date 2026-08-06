package com.megudacorp.realinvoice.entities.concretes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "invoice_lines")
public class InvoiceLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_line_id")
    private int invoiceLineId;

    private String itemName;
    private int quantity;
    private double price;
    private LocalDateTime recordDate;

    // Bu kalemin bağlı olduğu ana fatura
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    // Bu işlemi yapan kullanıcı
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public InvoiceLine() {}

}
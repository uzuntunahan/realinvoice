package com.megudacorp.realinvoice.entities.concretes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private int invoiceId;

    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private double totalAmount;
    private LocalDateTime recordDate;

    // Faturanın ait olduğu müşteri
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // Faturayı kesen kullanıcı
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Bir faturanın birden fazla kalemi (satırı) olur
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    private List<InvoiceLine> invoiceLines;

    public Invoice() {}

}
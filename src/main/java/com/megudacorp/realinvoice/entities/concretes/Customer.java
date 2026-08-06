package com.megudacorp.realinvoice.entities.concretes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private int customerId;

    private String taxNumber;
    private String title;
    private String address;
    private String email;
    private LocalDateTime recordDate;

    // Her müşteriyi sisteme ekleyen bir User vardır
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Customer() {}
}
package com.megudacorp.realinvoice.business.responses;

import lombok.Data;

@Data
public class LoginResponse {
    private int userId;
    private String userName;
    private String role; // "ADMIN" veya "USER" kontrolü için
    private boolean success;
}
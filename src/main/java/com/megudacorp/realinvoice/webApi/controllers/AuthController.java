package com.megudacorp.realinvoice.webApi.controllers;

import com.megudacorp.realinvoice.business.responses.LoginResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.megudacorp.realinvoice.business.abstracts.UserService;
import com.megudacorp.realinvoice.business.requests.LoginRequest;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        return this.userService.login(loginRequest);
    }
}
package com.megudacorp.realinvoice.business.abstracts;

import com.megudacorp.realinvoice.business.requests.LoginRequest;
import com.megudacorp.realinvoice.business.responses.LoginResponse;

public interface UserService {
    LoginResponse login(LoginRequest loginRequest);
}
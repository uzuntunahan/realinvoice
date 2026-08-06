package com.megudacorp.realinvoice.business.concretes;
import com.megudacorp.realinvoice.business.responses.LoginResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import com.megudacorp.realinvoice.business.abstracts.UserService;
import com.megudacorp.realinvoice.business.requests.LoginRequest;
import com.megudacorp.realinvoice.dataAccess.abstracts.UserRepository;
import com.megudacorp.realinvoice.entities.concretes.User;


@Service
@AllArgsConstructor
public class UserManager implements UserService {

    private final UserRepository userRepository;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        User user = this.userRepository.findByUserName(loginRequest.getUserName());
        LoginResponse response = new LoginResponse();

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            response.setUserId(user.getUserId());
            response.setUserName(user.getUserName());
            response.setSuccess(true);

            // Basitçe admin kontrolü (Kullanıcı adı admin ise ADMIN, değilse USER)
            if (user.getUserName().equalsIgnoreCase("admin")) {
                response.setRole("ADMIN");
            } else {
                response.setRole("USER");
            }
            return response;
        }

        response.setSuccess(false);
        return response;
    }
}
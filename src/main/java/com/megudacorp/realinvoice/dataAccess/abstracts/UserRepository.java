package com.megudacorp.realinvoice.dataAccess.abstracts;
import org.springframework.data.jpa.repository.JpaRepository;
import com.megudacorp.realinvoice.entities.concretes.User;


public interface UserRepository extends JpaRepository<User, Integer> {
    // Giriş yaparken kullanıcı adını veritabanında aratmak için bu metodu ekliyoruz
    User findByUserName(String userName);
}
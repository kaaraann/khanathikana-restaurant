package com.khanathikana.service;

import com.khanathikana.dto.AuthResponse;
import com.khanathikana.dto.LoginRequest;
import com.khanathikana.entity.User;
import com.khanathikana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public AuthResponse authenticate(LoginRequest request) {
        User user = null;
        
        if ("username".equals(request.getLoginType())) {
            Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
            if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
                user = userOpt.get();
            }
        } else if ("passcode".equals(request.getLoginType())) {
            Optional<User> userOpt = userRepository.findByPasscode(request.getPasscode());
            if (userOpt.isPresent()) {
                user = userOpt.get();
            }
        } else if ("card".equals(request.getLoginType())) {
            Optional<User> userOpt = userRepository.findByCardId(request.getCardId());
            if (userOpt.isPresent()) {
                user = userOpt.get();
            }
        }
        
        if (user != null && user.getActive()) {
            String token = generateToken(user);
            return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole());
        }
        
        throw new RuntimeException("Invalid credentials");
    }
    
    private String generateToken(User user) {
        return "TOKEN_" + user.getId() + "_" + System.currentTimeMillis();
    }
}

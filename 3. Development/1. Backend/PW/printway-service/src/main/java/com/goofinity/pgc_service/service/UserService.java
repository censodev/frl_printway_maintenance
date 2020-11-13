package com.goofinity.pgc_service.service;

import com.goofinity.pgc_service.domain.User;
import com.goofinity.pgc_service.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String getFullName(String email) {
        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        return user == null ? "" : user.getFullName();
    }
}

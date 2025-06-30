package com.CampusHub.CampusHub.Service;

import com.CampusHub.CampusHub.entities.Role;
import com.CampusHub.CampusHub.entities.User;
import com.CampusHub.CampusHub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminIfNotExists("systemadmin@ncit.edu.np", "Admin@123", Role.SYSTEMADMIN);
        createAdminIfNotExists("clubadmin@ncit.edu.np", "Club@123", Role.CLUBADMIN);
    }

    private void createAdminIfNotExists(String email, String rawPassword, Role role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            userRepository.save(user);
            System.out.println("Created admin user: " + email);
        }
    }
}


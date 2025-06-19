package com.CampusHub.CampusHub.Service;
import com.CampusHub.CampusHub.entities.User;
import com.CampusHub.CampusHub.Controller.UserController;
import com.CampusHub.CampusHub.entities.Role;
import com.CampusHub.CampusHub.Security.JwtUtil;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.CampusHub.CampusHub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;


    public User registerUser(UserController.UserSignUpRequest userSignUpRequest) {
        // Check if user with same email exists
        Optional<User> existingUser = userRepository.findByEmail(userSignUpRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists: " + userSignUpRequest.getEmail());
        }

        // Create new user instance
        User user = new User();
        user.setEmail(userSignUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userSignUpRequest.getPassword()));


        user.setRole(Role.USER);


        // Save the new user to the database
        return userRepository.save(user);
    }

    public Map<String, Object> loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT token for the user
        String token = jwtUtil.generateToken(user);

        // Create response map containing the token and email
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        System.out.println("Login response: " + response);  // Debug log

        return response;
    }
}

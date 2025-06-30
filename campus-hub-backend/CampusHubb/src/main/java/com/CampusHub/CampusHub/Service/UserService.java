package com.CampusHub.CampusHub.Service;

import com.CampusHub.CampusHub.entities.User;
import com.CampusHub.CampusHub.Controller.UserController;
import com.CampusHub.CampusHub.entities.Role;
import com.CampusHub.CampusHub.Security.JwtUtil;



import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.CampusHub.CampusHub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    public User registerUser(UserController.UserSignUpRequest userSignUpRequest) {
        String emailLower = userSignUpRequest.getEmail().toLowerCase();

        if (!emailLower.endsWith("@ncit.edu.np")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration allowed only with @ncit.edu.np email addresses.");
        }

        if (emailLower.equals("systemadmin@gmail.com") || emailLower.equals("clubadmin@gmail.com")) {
            throw new RuntimeException("This email is reserved and cannot be registered.");
        }

        Optional<User> existingUser = userRepository.findByEmail(userSignUpRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists: " + userSignUpRequest.getEmail());
        }

        // Create new user instance
        User user = new User();
        user.setEmail(userSignUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userSignUpRequest.getPassword()));
        user.setRole(Role.USER);   // default USER role

        // Generate verification token and set verified false
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerified(false);

        // Save the user with verification token and not verified
        userRepository.save(user);

        // Send verification email with token
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);


        return user;
    }

    public Map<String, Object> loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        System.out.println("User verified? " + user.isVerified());  // Debug here
        System.out.println("User role: " + user.getRole());

        // Only enforce verification for USER role
        if (user.getRole() == Role.USER && !user.isVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Please verify your email before logging in.");
        }

//        if (!user.isVerified()) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Please verify your email before logging in.");
//        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
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

    // Optional: method to verify email by token (you can put this in a controller/service)
    //This method takes a verification token (a unique string) as input. This token comes from the email link that the user clicks to verify their email address.

    public String verifyEmail(String token) {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);

        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid verification token");
        }

        User user = userOpt.get();
        user.setVerified(true);
        user.setVerificationToken(null);

        userRepository.save(user);

        return "Email verified successfully!";
    }
}

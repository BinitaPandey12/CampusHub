package com.CampusHub.CampusHub.Controller;


import com.CampusHub.CampusHub.Service.UserService;
import com.CampusHub.CampusHub.entities.User;
import com.CampusHub.CampusHub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RequestMapping("/api/auth")
@RestController
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>>  registerUser(@RequestBody UserSignUpRequest userSignUpRequest) {
        // If no role is provided, set default to 'ROLE_USER'
        if (userSignUpRequest.getRole() == null || userSignUpRequest.getRole().isEmpty()) {
            userSignUpRequest.setRole("USER"); // Default to 'ROLE_USER'
        }
        userService.registerUser(userSignUpRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration successful. Please check your email to verify your account.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        String trimmedEmail = loginRequest.getEmail().trim();
        Map<String, Object> result = userService.loginUser(trimmedEmail, loginRequest.getPassword());
        return ResponseEntity.ok(result);
    }




    public static class LoginRequest{
        private String email;
        private String password;
        public void setEmail(String email){
            this.email=email;
        }
        public  String getEmail(){
            return email;
        }
        public void setPassword(String password){
            this.password=password;
        }
        public String getPassword(){
            return password;
        }
    }

    public static class UserSignUpRequest {
        private String email;
        private String password;
        private String role;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

    }
    @CrossOrigin(origins = "http://localhost:5176")
    @GetMapping("/verify-email")
    public ResponseEntity<String>  verifyEmail(@RequestParam("token") String token) {
        String decodedToken = URLDecoder.decode(token, StandardCharsets.UTF_8);
        System.out.println("Decoded token: " + decodedToken);
        Optional<User> userOpt = userRepository.findByVerificationToken(token);

        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid verification token");
        }


        User user = userOpt.get();
        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);


//        return ResponseEntity.ok("Email verified successfully");
        // 2. Redirect to frontend verify page with success param
        URI redirectUri = URI.create("http://localhost:5173/verify-email?status=success");
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(redirectUri);
        return ResponseEntity.status(302).headers(headers).build();
    }
    }



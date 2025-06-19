package com.CampusHub.CampusHub.Controller;


import com.CampusHub.CampusHub.Service.UserService;
import com.CampusHub.CampusHub.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/api/auth")
@RestController
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/register")
    public User registerUser(@RequestBody UserSignUpRequest userSignUpRequest) {
        // If no role is provided, set default to 'ROLE_USER'
        if (userSignUpRequest.getRole() == null || userSignUpRequest.getRole().isEmpty()) {
            userSignUpRequest.setRole("USER"); // Default to 'ROLE_USER'
        }



        return userService.registerUser(userSignUpRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> result = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
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
}

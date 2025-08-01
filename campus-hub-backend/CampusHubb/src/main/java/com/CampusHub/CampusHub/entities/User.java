package com.CampusHub.CampusHub.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)   //If the first user’s id = 1, the next will be 2, then 3, and so on.
    private Long  id;
    @Column(unique = true)
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role=Role.USER;  //role column will have value "USER" or "ADMIN" reference=Role.java
   @Column(name="verification_token")
    private String verificationToken;   //store the unique token sent to the user's email.(email verification.)
    @Column(name = "is_verified")
    private boolean isVerified;       //will be used to block login until email is verified.

    @Column(name = "reset_token")  //stores unique token used for password reset.
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;   //yo

    public LocalDateTime getResetTokenExpiry() {    //yo
        return resetTokenExpiry;
    }

    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {    //yo
        this.resetTokenExpiry = resetTokenExpiry;
    }


    private String fullName;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public boolean isVerified() {
        return isVerified;
    }
    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }
    public String getResetToken() {
        return resetToken;
    }
    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role=role;
    }


    public void setVerificationToken(String verificationToken) {
        this.verificationToken=verificationToken;
    }
    public String getVerificationToken() {
        return verificationToken;
    }
}

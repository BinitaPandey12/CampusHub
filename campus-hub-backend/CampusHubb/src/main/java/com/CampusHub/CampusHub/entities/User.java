package com.CampusHub.CampusHub.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

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

//    public Long getId() {
//        return id;
//    }

//    public void setId(Long id) {
//        this.id = id;
//    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role=role;
    }

}

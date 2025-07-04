package com.CampusHub.CampusHub.dto;

public class UserBasicDTO {
    private Long id;
    private String email;

    public UserBasicDTO(Long id, String email) {
        this.id = id;
        this.email = email;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
}

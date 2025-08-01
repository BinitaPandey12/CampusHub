package com.CampusHub.CampusHub.dto;

public class UserBasicDTO {
    private Long id;
    private String email;
    private String fullName;

//    public String getFullName() {
//        return fullName;
//    }
//
//    public void setFullName(String fullName) {
//        this.fullName = fullName;
//    }

    public UserBasicDTO(Long id, String email, String fullName) {
        this.id = id;
        this.email = email;
        this.fullName=fullName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public void setfullName(String fullName) {
        this.fullName = fullName;
    }
    public String getfullName() {
        return fullName;
    }



    public Long getId() { return id; }
    public String getEmail() { return email; }
}

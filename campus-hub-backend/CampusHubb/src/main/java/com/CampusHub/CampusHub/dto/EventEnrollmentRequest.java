package com.CampusHub.CampusHub.dto;



import com.CampusHub.CampusHub.entities.EnrollmentStatus;
import lombok.Data;

@Data
public class EventEnrollmentRequest {
    private Long eventId;
    private String fullName;
    private String email;
    private String department;
    private String contactNo;
    private String semester;
//    private EnrollmentStatus status;

//    public EnrollmentStatus getStatus() {
//        return status;
//    }
//
//    public void setStatus(EnrollmentStatus status) {
//        this.status = status;
//    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
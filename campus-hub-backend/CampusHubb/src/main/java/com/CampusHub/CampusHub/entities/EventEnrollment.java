package com.CampusHub.CampusHub.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "event_enrollments")
public class EventEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String department;

    @Column(name = "contact_no", nullable = false)
    private String contactNo;

    @Column(nullable = false)
    private String semester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status = EnrollmentStatus.APPLIED;

    @Column(name = "enrollment_date", nullable = false)
    private LocalDateTime enrollmentDate = LocalDateTime.now();


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }

    public LocalDateTime getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDateTime enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }
}

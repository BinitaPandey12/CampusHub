package com.CampusHub.CampusHub.repositories;



import com.CampusHub.CampusHub.entities.EventEnrollment;
import com.CampusHub.CampusHub.entities.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventEnrollmentRepository extends JpaRepository<EventEnrollment, Long> {

    // Find all enrollments by user email
    List<EventEnrollment> findByEmailOrderByEnrollmentDateDesc(String email);

    // Find all enrollments by user email and status
    List<EventEnrollment> findByEmailAndStatusOrderByEnrollmentDateDesc(String email, EnrollmentStatus status);

    // Check if user is already enrolled in an event
    Optional<EventEnrollment> findByEmailAndEventId(String email, Long eventId);

    // Find all enrollments for a specific event
    List<EventEnrollment> findByEventId(Long eventId);

    // Find all enrollments by status
    List<EventEnrollment> findByStatusOrderByEnrollmentDateDesc(EnrollmentStatus status);
    List<EventEnrollment> findByEventIdAndStatus(Long eventId, EnrollmentStatus status);
}

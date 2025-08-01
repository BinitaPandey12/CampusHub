package com.CampusHub.CampusHub.Service;



import com.CampusHub.CampusHub.dto.EventEnrollmentRequest;
import com.CampusHub.CampusHub.dto.EventEnrollmentResponse;
import com.CampusHub.CampusHub.dto.EventEnrollmentUserInfoResponse;
import com.CampusHub.CampusHub.entities.Event;
import com.CampusHub.CampusHub.entities.EventEnrollment;
import com.CampusHub.CampusHub.entities.EnrollmentStatus;
import com.CampusHub.CampusHub.exception.ResourceNotFoundException;
import com.CampusHub.CampusHub.repositories.EventEnrollmentRepository;
import com.CampusHub.CampusHub.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventEnrollmentService {

    @Autowired
    private EventEnrollmentRepository eventEnrollmentRepository;

    @Autowired
    private EventRepository eventRepository;

    public EventEnrollmentResponse enrollInEvent(EventEnrollmentRequest request) {
        // Check if event exists
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        // Check if user is already enrolled in this event
        if (eventEnrollmentRepository.findByEmailAndEventId(request.getEmail(), request.getEventId()).isPresent()) {
            throw new RuntimeException("User is already enrolled in this event");
        }

        // Create new enrollment
        EventEnrollment enrollment = new EventEnrollment();
        enrollment.setEvent(event);
        enrollment.setFullName(request.getFullName());
        enrollment.setEmail(request.getEmail());
        enrollment.setDepartment(request.getDepartment());
        enrollment.setContactNo(request.getContactNo());
        enrollment.setSemester(request.getSemester());
        enrollment.setStatus(EnrollmentStatus.APPLIED);

        EventEnrollment savedEnrollment = eventEnrollmentRepository.save(enrollment);

        return convertToResponse(savedEnrollment);
    }

    public List<EventEnrollmentUserInfoResponse> getEnrollmentsByEventIdUserInfo(Long eventId) {
        List<EventEnrollment> enrollments = eventEnrollmentRepository.findByEventId(eventId);
        return enrollments.stream()
                .map(this::convertToUserInfoResponse)
                .collect(Collectors.toList());
    }

    private EventEnrollmentUserInfoResponse convertToUserInfoResponse(EventEnrollment enrollment) {
        EventEnrollmentUserInfoResponse response = new EventEnrollmentUserInfoResponse();
        response.setFullName(enrollment.getFullName());
        response.setEmail(enrollment.getEmail());
        response.setDepartment(enrollment.getDepartment());
        response.setContactNo(enrollment.getContactNo());
        response.setSemester(enrollment.getSemester());
        response.setEnrollmentDate(enrollment.getEnrollmentDate());
        return response;
    }


    public List<EventEnrollmentResponse> getEnrollmentsByEventId(Long eventId) {
        List<EventEnrollment> enrollments = eventEnrollmentRepository.findByEventId(eventId);
        return enrollments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<EventEnrollmentResponse> getUserEnrollments(String email) {
        List<EventEnrollment> enrollments = eventEnrollmentRepository.findByEmailOrderByEnrollmentDateDesc(email);
        return enrollments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<EventEnrollmentResponse> getUserEnrollmentsByStatus(String email, EnrollmentStatus status) {
        List<EventEnrollment> enrollments = eventEnrollmentRepository.findByEmailAndStatusOrderByEnrollmentDateDesc(email, status);
        return enrollments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public EventEnrollmentResponse getEnrollmentById(Long enrollmentId) {
        EventEnrollment enrollment = eventEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
        return convertToResponse(enrollment);
    }

    public List<EventEnrollmentUserInfoResponse> getAppliedEnrollmentsByEventIdUserInfo(Long eventId) {
        List<EventEnrollment> enrollments = eventEnrollmentRepository.findByEventIdAndStatus(eventId, EnrollmentStatus.APPLIED);
        return enrollments.stream()
                .map(this::convertToUserInfoResponse)
                .collect(Collectors.toList());
    }

    public EventEnrollmentResponse updateEnrollmentStatus(Long enrollmentId, EnrollmentStatus status) {
        EventEnrollment enrollment = eventEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        enrollment.setStatus(status);
        EventEnrollment updatedEnrollment = eventEnrollmentRepository.save(enrollment);
        return convertToResponse(updatedEnrollment);
    }

    public void cancelEnrollment(Long enrollmentId) {
        EventEnrollment enrollment = eventEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));

        enrollment.setStatus(EnrollmentStatus.CANCELLED);
        eventEnrollmentRepository.save(enrollment);
    }

    private EventEnrollmentResponse convertToResponse(EventEnrollment enrollment) {
        EventEnrollmentResponse response = new EventEnrollmentResponse();
        response.setId(enrollment.getId());
        response.setEventId(enrollment.getEvent().getId());
        response.setEventTitle(enrollment.getEvent().getTitle());
        response.setFullName(enrollment.getFullName());
        response.setEmail(enrollment.getEmail());
        response.setDepartment(enrollment.getDepartment());
        response.setContactNo(enrollment.getContactNo());
        response.setSemester(enrollment.getSemester());
        response.setStatus(enrollment.getStatus());
        response.setEnrollmentDate(enrollment.getEnrollmentDate());
        return response;
    }
}

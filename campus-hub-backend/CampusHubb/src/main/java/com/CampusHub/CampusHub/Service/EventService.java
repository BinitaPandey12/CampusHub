package com.CampusHub.CampusHub.Service;




import com.CampusHub.CampusHub.dto.EventEnrollmentRequest;
import com.CampusHub.CampusHub.dto.EventEnrollmentResponse;
import com.CampusHub.CampusHub.dto.EventRequest;
import com.CampusHub.CampusHub.dto.EventResponse;
import com.CampusHub.CampusHub.entities.*;
import com.CampusHub.CampusHub.exception.ResourceNotFoundException;
import com.CampusHub.CampusHub.repositories.EventEnrollmentRepository;
import com.CampusHub.CampusHub.repositories.EventRepository;
import com.CampusHub.CampusHub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private EventEnrollmentRepository eventEnrollmentRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;

    }




    public EventResponse createEvent(EventRequest eventRequest) {
        // Get the currently authenticated user (club admin)
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new com.CampusHub.CampusHub.exception.ResourceNotFoundException("User not found"));

        // Create and save the event
        Event event = new Event();
        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setDate(eventRequest.getDate());
        event.setTime(eventRequest.getTime());
        event.setLocation(eventRequest.getLocation());
        event.setStatus(com.CampusHub.CampusHub.entities.EventStatus.PENDING); // Default status

        // Set the creator
        event.setCreatedBy(user);

        Event savedEvent = eventRepository.save(event);

        return mapToEventResponse(savedEvent);
    }
    public List<EventResponse> getMyPendingEvents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return eventRepository.findByCreatedByAndStatus(user, EventStatus.PENDING)
                .stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getMyApprovedEvents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return eventRepository.findByCreatedByAndStatus(user, EventStatus.APPROVED)
                .stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getMyRejectedEvents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return eventRepository.findByCreatedByAndStatus(user, EventStatus.REJECT)
                .stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getPendingEvents() {
        return eventRepository.findByStatus(EventStatus.PENDING).stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getApprovedEvents() {
        return eventRepository.findByStatus(EventStatus.APPROVED).stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElse(null);
        if (event == null) return null;
        return mapToEventResponse(event);
    }


    public EventResponse approveEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Only system admins can approve events (handled in controller)
        event.setStatus(EventStatus.APPROVED);
        Event updatedEvent = eventRepository.save(event);

        return mapToEventResponse(updatedEvent);
    }
    public EventResponse rejectEvent(Long eventId, String rejectionMessage) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(EventStatus.REJECT);
        event.setRejectionMessage(rejectionMessage);
        Event updatedEvent = eventRepository.save(event);
        return mapToEventResponse(updatedEvent);
    }
    public List<EventResponse> getRejectedEvents() {
        return eventRepository.findByStatus(EventStatus.REJECT).stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }


    private EventResponse mapToEventResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setDate(event.getDate());
        response.setTime(event.getTime());
        response.setLocation(event.getLocation());
        response.setStatus(event.getStatus());
        response.setRejectionMessage(event.getRejectionMessage());
        response.setCreatedByEmail(event.getCreatedBy() != null ? event.getCreatedBy().getEmail() : null);
        response.setCreatedByFullName(
                event.getCreatedBy() != null ? event.getCreatedBy().getFullName() : null
        );
        return response;
    }
}

//
//package com.CampusHub.CampusHub.Service;
//
//import com.CampusHub.CampusHub.dto.EventEnrollmentRequest;
//import com.CampusHub.CampusHub.dto.EventEnrollmentResponse;
//import com.CampusHub.CampusHub.entities.Event;
//import com.CampusHub.CampusHub.entities.EventEnrollment;
//import com.CampusHub.CampusHub.entities.EnrollmentStatus;
//import com.CampusHub.CampusHub.exception.ResourceNotFoundException;
//import com.CampusHub.CampusHub.repositories.EventEnrollmentRepository;
//import com.CampusHub.CampusHub.repositories.EventRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class EventEnrollmentService {
//
//    @Autowired
//    private EventEnrollmentRepository eventEnrollmentRepository;
//
//    @Autowired
//    private EventRepository eventRepository;
//
//    public EventEnrollmentResponse enrollInEvent(EventEnrollmentRequest request) {
//        // Check if event exists
//        Event event = eventRepository.findById(request.getEventId())
//                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));
//
//        // Check if user is already enrolled in this event
//        if (eventEnrollmentRepository.findByEmailAndEventId(request.getEmail(), request.getEventId()).isPresent()) {
//            throw new RuntimeException("User is already enrolled in this event");
//        }
//
//        // Create new enrollment
//        EventEnrollment enrollment = new EventEnrollment();
//        enrollment.setEvent(event);
//        enrollment.setFullName(request.getFullName());
//        enrollment.setEmail(request.getEmail());
//        enrollment.setDepartment(request.getDepartment());
//        enrollment.setContactNo(request.getContactNo());
//        enrollment.setSemester(request.getSemester());
//        enrollment.setStatus(EnrollmentStatus.APPLIED);
//
//        EventEnrollment savedEnrollment = eventEnrollmentRepository.save(enrollment);
//
//        return convertToResponse(savedEnrollment);
//    }
//
//    public List<EventEnrollmentResponse> getUserEnrollments(String email) {
//        List<EventEnrollment> enrollments = eventEnrollmentRepository.findByEmailOrderByEnrollmentDateDesc(email);
//        return enrollments.stream()
//                .map(this::convertToResponse)
//                .collect(Collectors.toList());
//    }
//
//    public List<EventEnrollmentResponse> getUserEnrollmentsByStatus(String email, EnrollmentStatus status) {
//        List<EventEnrollment> enrollments = eventEnrollmentRepository.findByEmailAndStatusOrderByEnrollmentDateDesc(email, status);
//        return enrollments.stream()
//                .map(this::convertToResponse)
//                .collect(Collectors.toList());
//    }
//
//    public EventEnrollmentResponse getEnrollmentById(Long enrollmentId) {
//        EventEnrollment enrollment = eventEnrollmentRepository.findById(enrollmentId)
//                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
//        return convertToResponse(enrollment);
//    }
//
//    public EventEnrollmentResponse updateEnrollmentStatus(Long enrollmentId, EnrollmentStatus status) {
//        EventEnrollment enrollment = eventEnrollmentRepository.findById(enrollmentId)
//                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
//
//        enrollment.setStatus(status);
//        EventEnrollment updatedEnrollment = eventEnrollmentRepository.save(enrollment);
//        return convertToResponse(updatedEnrollment);
//    }
//
//    public void cancelEnrollment(Long enrollmentId) {
//        EventEnrollment enrollment = eventEnrollmentRepository.findById(enrollmentId)
//                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
//
//        enrollment.setStatus(EnrollmentStatus.CANCELLED);
//        eventEnrollmentRepository.save(enrollment);
//    }
//
//    private EventEnrollmentResponse convertToResponse(EventEnrollment enrollment) {
//        EventEnrollmentResponse response = new EventEnrollmentResponse();
//        response.setId(enrollment.getId());
//        response.setEventId(enrollment.getEvent().getId());
//        response.setEventTitle(enrollment.getEvent().getTitle());
//        response.setFullName(enrollment.getFullName());
//        response.setEmail(enrollment.getEmail());
//        response.setDepartment(enrollment.getDepartment());
//        response.setContactNo(enrollment.getContactNo());
//        response.setSemester(enrollment.getSemester());
//        response.setStatus(enrollment.getStatus());
//        response.setEnrollmentDate(enrollment.getEnrollmentDate());
//        return response;
//    }

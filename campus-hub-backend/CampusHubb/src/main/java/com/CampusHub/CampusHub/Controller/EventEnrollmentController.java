package com.CampusHub.CampusHub.Controller;



import com.CampusHub.CampusHub.dto.EventEnrollmentRequest;
import com.CampusHub.CampusHub.dto.EventEnrollmentResponse;
import com.CampusHub.CampusHub.dto.EventEnrollmentUserInfoResponse;
import com.CampusHub.CampusHub.entities.EnrollmentStatus;
import com.CampusHub.CampusHub.Service.EventEnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")

public class EventEnrollmentController {

    @Autowired
    private EventEnrollmentService eventEnrollmentService;


    @PostMapping("/register")
    public ResponseEntity<EventEnrollmentResponse> enrollInEvent(@RequestBody EventEnrollmentRequest request) {
        try {
            EventEnrollmentResponse response = eventEnrollmentService.enrollInEvent(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/user/{email}")
    public ResponseEntity<List<EventEnrollmentResponse>> getUserEnrollments(@PathVariable String email) {
        try {
            List<EventEnrollmentResponse> enrollments = eventEnrollmentService.getUserEnrollments(email);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

//@GetMapping("/event/{eventId}/enrollments")
//public ResponseEntity<List<EventEnrollmentUserInfoResponse>> getEnrollmentsByEventId(@PathVariable Long eventId) {
//    try {
//        List<EventEnrollmentUserInfoResponse> enrollments = eventEnrollmentService.getEnrollmentsByEventIdUserInfo(eventId);
//        return ResponseEntity.ok(enrollments);
//    } catch (Exception e) {
//        return ResponseEntity.notFound().build();
//    }
//}

    @GetMapping("/event/{eventId}/enrollments")
    public ResponseEntity<List<EventEnrollmentUserInfoResponse>> getEnrollmentsByEventId(@PathVariable Long eventId) {
        try {
            List<EventEnrollmentUserInfoResponse> enrollments = eventEnrollmentService.getAppliedEnrollmentsByEventIdUserInfo(eventId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/user/{email}/status/{status}")
    public ResponseEntity<List<EventEnrollmentResponse>> getUserEnrollmentsByStatus(
            @PathVariable String email,
            @PathVariable EnrollmentStatus status) {
        try {
            List<EventEnrollmentResponse> enrollments = eventEnrollmentService.getUserEnrollmentsByStatus(email, status);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }



    @GetMapping("/{enrollmentId}")
    public ResponseEntity<EventEnrollmentResponse> getEnrollmentById(@PathVariable Long enrollmentId) {
        try {
            EventEnrollmentResponse enrollment = eventEnrollmentService.getEnrollmentById(enrollmentId);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{enrollmentId}/status")
    public ResponseEntity<EventEnrollmentResponse> updateEnrollmentStatus(
            @PathVariable Long enrollmentId,
            @RequestParam EnrollmentStatus status) {
        try {
            EventEnrollmentResponse response = eventEnrollmentService.updateEnrollmentStatus(enrollmentId, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<Void> cancelEnrollment(@PathVariable Long enrollmentId) {
        try {
            eventEnrollmentService.cancelEnrollment(enrollmentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

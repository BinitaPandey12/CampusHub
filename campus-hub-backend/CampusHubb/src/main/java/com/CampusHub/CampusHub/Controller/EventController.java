package com.CampusHub.CampusHub.Controller;

import com.CampusHub.CampusHub.Service.EventService;
import com.CampusHub.CampusHub.dto.EventRejectionRequest;
import com.CampusHub.CampusHub.dto.EventRequest;
import com.CampusHub.CampusHub.dto.EventResponse;
import com.CampusHub.CampusHub.dto.UserBasicDTO;
import com.CampusHub.CampusHub.entities.Role;
import com.CampusHub.CampusHub.entities.User;
import com.CampusHub.CampusHub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    private final UserRepository userRepository;

    public EventController(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }


    @PostMapping
    @PreAuthorize("hasAuthority('CLUBADMIN')")
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventRequest eventRequest) {
        EventResponse response = eventService.createEvent(eventRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-pending")
    @PreAuthorize("hasAuthority('CLUBADMIN')")
    public ResponseEntity<List<EventResponse>> getMyPendingEvents() {
        List<EventResponse> responses = eventService.getMyPendingEvents();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/my-approved")
    @PreAuthorize("hasAuthority('CLUBADMIN')")
    public ResponseEntity<List<EventResponse>> getMyApprovedEvents() {
        List<EventResponse> responses = eventService.getMyApprovedEvents();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/my-rejected")
    @PreAuthorize("hasAuthority('CLUBADMIN')")
    public ResponseEntity<List<EventResponse>> getMyRejectedEvents() {
        List<EventResponse> responses = eventService.getMyRejectedEvents();
        return ResponseEntity.ok(responses);
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> responses = eventService.getAllEvents();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('CLUBADMIN') or hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<List<EventResponse>> getPendingEvents() {
        List<EventResponse> responses = eventService.getPendingEvents();
        return ResponseEntity.ok(responses);
    }

    // Delete a registered user by ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        userRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }


    // Delete a club admin by ID
    @DeleteMapping("/club-admins/{id}")
    public ResponseEntity<?> deleteClubAdmin(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Club admin not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = userOpt.get();
        if (user.getRole() == null || user.getRole() != Role.CLUBADMIN) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Club admin not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        userRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Club admin deleted successfully");
        return ResponseEntity.ok(response);
    }


    //user info
    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('CLUBADMIN', 'SYSTEMADMIN', 'USER')")
    public ResponseEntity<List<UserBasicDTO>> getAllRegularUsers() {
        List<UserBasicDTO> users = userRepository.findByRole(Role.USER).stream()
                .map(user -> new UserBasicDTO(user.getId(), user.getEmail(), user.getFullName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/approved")
    public ResponseEntity<List<EventResponse>> getApprovedEvents() {
        List<EventResponse> responses = eventService.getApprovedEvents();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/rejected")
    @PreAuthorize("hasAuthority('CLUBADMIN') or hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<List<EventResponse>> getRejectedEvents() {
        List<EventResponse> responses = eventService.getRejectedEvents();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEventDetailsById(@PathVariable Long eventId) {
        EventResponse response = eventService.getEventById(eventId);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }




    @PatchMapping("/{eventId}/approve")
    @PreAuthorize("hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long eventId) {
        EventResponse response = eventService.approveEvent(eventId);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/{eventId}/reject")
    @PreAuthorize("hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<EventResponse> rejectEvent(
            @PathVariable Long eventId,
            @RequestBody EventRejectionRequest rejectionRequest) {
        EventResponse response = eventService.rejectEvent(eventId, rejectionRequest.getMessage());
        return ResponseEntity.ok(response);
    }
}

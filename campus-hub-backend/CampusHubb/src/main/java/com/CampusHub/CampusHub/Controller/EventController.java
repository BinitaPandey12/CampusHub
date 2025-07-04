package com.CampusHub.CampusHub.Controller;

import com.CampusHub.CampusHub.Service.EventService;
import com.CampusHub.CampusHub.dto.EventRequest;
import com.CampusHub.CampusHub.dto.EventResponse;
import com.CampusHub.CampusHub.dto.UserBasicDTO;
import com.CampusHub.CampusHub.entities.Role;
import com.CampusHub.CampusHub.entities.User;
import com.CampusHub.CampusHub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('CLUBADMIN', 'SYSTEMADMIN', 'USER')")
    public ResponseEntity<List<UserBasicDTO>> getAllRegularUsers() {
        List<UserBasicDTO> users = userRepository.findByRole(Role.USER).stream()
                .map(user -> new UserBasicDTO(user.getId(), user.getEmail()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/approved")
    public ResponseEntity<List<EventResponse>> getApprovedEvents() {
        List<EventResponse> responses = eventService.getApprovedEvents();
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{eventId}/approve")
    @PreAuthorize("hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long eventId) {
        EventResponse response = eventService.approveEvent(eventId);
        return ResponseEntity.ok(response);
    }
//    @PutMapping("/{eventId}/reject")
//    @PreAuthorize("hasAuthority('SYSTEMADMIN')")
//    public ResponseEntity<EventResponse> rejectEvent(@PathVariable Long eventId) {
//        EventResponse response = eventService.rejectEvent(eventId);
//        return ResponseEntity.ok(response);
//    }
}

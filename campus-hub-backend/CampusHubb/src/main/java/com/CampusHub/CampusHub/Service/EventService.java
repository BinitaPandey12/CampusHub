package com.CampusHub.CampusHub.Service;




import com.CampusHub.CampusHub.dto.EventRequest;
import com.CampusHub.CampusHub.dto.EventResponse;
import com.CampusHub.CampusHub.entities.Event;
import com.CampusHub.CampusHub.entities.EventStatus;
import com.CampusHub.CampusHub.entities.User;
import com.CampusHub.CampusHub.exception.ResourceNotFoundException;
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

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public EventResponse createEvent(EventRequest eventRequest) {
        // Get the currently authenticated user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Create and save the event
        Event event = new Event();
        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setDate(eventRequest.getDate());
        event.setTime(eventRequest.getTime());
        event.setLocation(eventRequest.getLocation());
        event.setStatus(EventStatus.PENDING); // Default status


        Event savedEvent = eventRepository.save(event);

        return mapToEventResponse(savedEvent);
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


    public EventResponse approveEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Only system admins can approve events (handled in controller)
        event.setStatus(EventStatus.APPROVED);
        Event updatedEvent = eventRepository.save(event);

        return mapToEventResponse(updatedEvent);
    }
    public EventResponse rejectEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Only system admins can approve events (handled in controller)
        event.setStatus(EventStatus.REJECT);
        Event updatedEvent = eventRepository.save(event);

        return mapToEventResponse(updatedEvent);
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

        return response;
    }
}

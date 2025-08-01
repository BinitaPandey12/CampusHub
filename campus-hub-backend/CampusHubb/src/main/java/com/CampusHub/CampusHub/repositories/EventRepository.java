package com.CampusHub.CampusHub.repositories;

import com.CampusHub.CampusHub.entities.Event;
import com.CampusHub.CampusHub.entities.EventStatus;
import com.CampusHub.CampusHub.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
//    @Query("SELECT e FROM Event e WHERE UPPER(e.status) = 'APPROVED'")
    List<Event> findByStatus(EventStatus status);
    List<Event> findByCreatedByAndStatus(User createdBy, EventStatus status);

}

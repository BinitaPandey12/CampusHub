package com.CampusHub.CampusHub.Controller;

import com.CampusHub.CampusHub.Service.UserService;
import com.CampusHub.CampusHub.dto.CreateClubAdmin;
import com.CampusHub.CampusHub.entities.Role;
import com.CampusHub.CampusHub.entities.User;
import com.CampusHub.CampusHub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/admins")
    @PreAuthorize("hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<List<User>> getAllAdmins() {
        List<User> admins = userRepository.findByRole(Role.CLUBADMIN);
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('CLUBADMIN') or hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findByRole(Role.USER);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/club-admin")
    @PreAuthorize("hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<?> createClubAdmin(@RequestBody com.CampusHub.CampusHub.dto.CreateClubAdminRequest request) {
        try {
            User newClubAdmin = userService.createClubAdmin(request);
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "Club admin created successfully");
            response.put("clubAdmin", java.util.Map.of(
                "id", newClubAdmin.getId(),
                "email", newClubAdmin.getEmail(),
                "fullName", newClubAdmin.getFullName(),
                "role", newClubAdmin.getRole()
            ));
            return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            java.util.Map<String, String> error = new java.util.HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/admins/{id}")
    @PreAuthorize("hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('SYSTEMADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}


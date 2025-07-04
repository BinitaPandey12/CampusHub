package com.CampusHub.CampusHub.Controller;

import com.CampusHub.CampusHub.entities.Role;
import com.CampusHub.CampusHub.entities.User;
import com.CampusHub.CampusHub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

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


package com.CampusHub.CampusHub.repositories;

import com.CampusHub.CampusHub.entities.Role;
import com.CampusHub.CampusHub.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByResetToken(String resetToken);  //yo



}

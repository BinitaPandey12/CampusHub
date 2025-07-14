package com.CampusHub.CampusHub.Service;

import com.CampusHub.CampusHub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service   //ou can then use @Autowired or constructor injection to use it in other classes
public class CustomUserDetailsService implements UserDetailsService  {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.CampusHub.CampusHub.entities.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return User.builder()
                .username(email)
                .password("")

                .authorities(new ArrayList<>())
                .build();

    }
}

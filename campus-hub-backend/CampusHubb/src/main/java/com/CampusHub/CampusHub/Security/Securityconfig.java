package com.CampusHub.CampusHub.Security;

import com.CampusHub.CampusHub.CustomAccessDeniedHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;


@Configuration
@EnableWebSecurity
public class Securityconfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private CustomAccessDeniedHandler customAccessDeniedHandler;


    public Securityconfig (JwtAuthenticationFilter jwtAuthenticationFilter,
                           CustomAccessDeniedHandler customAccessDeniedHandler){
        this.jwtAuthenticationFilter=jwtAuthenticationFilter;
        this.customAccessDeniedHandler=customAccessDeniedHandler;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,CustomAccessDeniedHandler accessDeniedHandler)throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() //for public access without any authentication.
//                        .requestMatchers("/api/account/**").authenticated()
//                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")  //users with role=ADMIN can access it
                        .anyRequest().authenticated()

                )
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .formLogin().disable()
                .httpBasic().disable()
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean   // Needed for authentication manager (used later in login)
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)throws Exception{
        return config.getAuthenticationManager();

    }

}

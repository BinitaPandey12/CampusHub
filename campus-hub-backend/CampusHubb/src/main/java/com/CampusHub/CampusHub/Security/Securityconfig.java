package com.CampusHub.CampusHub.Security;

import com.CampusHub.CampusHub.CustomAccessDeniedHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
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
//                .cors(Customizer.withDefaults())
//                .csrf(csrf -> csrf.disable())
//                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.GET,"/api/events/users/{id}").hasAuthority("SYSTEMADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/events/club-admins/{id}").hasAuthority("SYSTEMADMIN")
                        .requestMatchers("/api/auth/**").permitAll() //for public access without any authentication.
                        .requestMatchers("/api/events/approved").hasAnyAuthority("CLUBADMIN","USER")
                        .requestMatchers(HttpMethod.GET,"/api/events/pending").hasAnyAuthority("SYSTEMADMIN","CLUBADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/auth/current-user").hasAuthority("USER")
                        .requestMatchers("/api/events").hasAuthority("CLUBADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/events/users").hasAnyAuthority("CLUBADMIN","SYSTEMADMIN","USER")
                        .requestMatchers("/api/enrollments/register").hasAnyAuthority("USER","CLUBADMIN")
                        .requestMatchers("/api/enrollments/**").hasAnyAuthority("USER","CLUBADMIN")
                        .requestMatchers("/api/enrollments/event/{eventId}/enrollments").hasAnyAuthority("CLUBADMIN","USER")
                        .requestMatchers(HttpMethod.PATCH, "/api/events/*/approve").hasAuthority("SYSTEMADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/events/*/reject").hasAuthority("SYSTEMADMIN")
                        .requestMatchers("/api/events/**").hasAnyAuthority("SYSTEMADMIN","CLUBADMIN","USER")
                        .requestMatchers("/api/events").hasAnyAuthority("CLUBADMIN", "SYSTEMADMIN")
                        .requestMatchers("/api/events/{email}").hasAuthority("CLUBADMIN")
                        .requestMatchers("/api/admins/**").hasAuthority("SYSTEMADMIN")
                                .requestMatchers( HttpMethod.GET,"/api/users").hasAnyAuthority("SYSTEMADMIN","CLUBADMIN")
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

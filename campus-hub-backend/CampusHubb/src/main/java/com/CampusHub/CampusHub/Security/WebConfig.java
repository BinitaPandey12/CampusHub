package com.CampusHub.CampusHub.Security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer(){
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedHeaders("*") // Allow all headers
                        .allowedMethods("*")
                .allowCredentials(true);

            }
        };
    }

    @Bean     //raw passwords will be hashed before being saved to the database.
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


}

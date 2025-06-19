package com.CampusHub.CampusHub;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component   //component so it can be used everywhere it needed
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request,   //request: The incoming HTTP request
                       HttpServletResponse response, //response: The HTTP response (where you'll write the error)
                       AccessDeniedException accessDeniedException) //accessDeniedException: Info about why access was denied
            throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); //ell the client what happened (403 = Forbidden) otherwise it would mislead as (200 OK,=success)
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Only access to admin\"}");
        response.getWriter().flush();
    }
}

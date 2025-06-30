package com.CampusHub.CampusHub.Security;
import com.CampusHub.CampusHub.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component      //in class use @Component ,for methods inside configuration class use @Bean
public class JwtUtil {



    private static final String SECRET_KEY_STRING = "bXktdmVyeS1sb25nLXN1cGVyLXNlY3JldC1rZXktd2hpY2gtaXMtb3Zlci0yNTYtYml0cw==";

    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY_STRING));





    private final long EXPIRATION_MS=86400000;   //tokens will expire after 1 day of being created.

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }



    //generates token using User object and embeds role
    public String generateToken(User user){
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name()); // Embed role info into JWT
//        claims.put("user_id", user.getId());  // Add user_id to the token
        claims.put("Email",user.getEmail());


        return createToken(claims, user.getEmail());
    }
    // Helper method to create token with claims + subject (email)
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // email will be subject
                .setIssuedAt(new Date())
//                .setSubject(user.getId().toString())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractEmail(String Token){   //extracts from token to identify identity
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY) //validate tokens from SIGNKEY
                .build()
                .parseClaimsJws(Token)
                .getBody()
                .getSubject();

    }
    public boolean validateToken(String token){    //if validate token with secretkey true ..if everything fine true..false
        System.out.println("Generated JWT Token: " + token);

        try{
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;   //"Is the token real and still valid? Return true or false."
        }catch (JwtException e){
            return false;
        }

    }

    public Long extractUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Object userIdObj = claims.get("user_id");

        if (userIdObj instanceof Integer) {
            return ((Integer) userIdObj).longValue();
        } else if (userIdObj instanceof Long) {
            return (Long) userIdObj;
        } else {
            System.out.println("user_id claim is missing or of unexpected type: " + userIdObj);
            return null;
        }
    }


}

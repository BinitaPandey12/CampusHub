package com.CampusHub.CampusHub.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("pbinita398@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Verify your email for CampusHub");

            // URL to your frontend or backend verification endpoint with token param
            String verifyUrl = "http://localhost:8080/api/auth/verify-email?token=" + token;

            String content = "<p>Thank you for registering.</p>"
                    + "<p>Please click the link below to verify your email:</p>"
                    + "<a href=\"" + verifyUrl + "\">VERIFY EMAIL</a>";

            helper.setText(content, true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //yo

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("pbinita398@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Reset your password for CampusHub");

            // URL to your frontend reset password page with token param
            String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;

            String content = "<p>You requested a password reset.</p>"
                    + "<p>Please click the link below to reset your password:</p>"
                    + "<a href=\"" + resetUrl + "\">RESET PASSWORD</a>"
                    + "<p>This link will expire in 1 hour.</p>"
                    + "<p>If you didn't request this, please ignore this email.</p>";

            helper.setText(content, true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


package com.devoza.authapp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.*;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Your OTP Code - AuthApp");
            helper.setText(buildHtmlBody(otp), true);
            mailSender.send(message);
            log.info("OTP email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    private String buildHtmlBody(String otp) {
        return """
            <div style=\"font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;\">
              <h2 style=\"color:#01696f;\">Your One-Time Password</h2>
              <p style=\"color:#555;\">Use the code below to verify your identity. It expires in <strong>5 minutes</strong>.</p>
              <div style=\"font-size:36px;font-weight:bold;letter-spacing:12px;color:#28251d;background:#fff;padding:16px 24px;border-radius:6px;text-align:center;margin:24px 0;\">%s</div>
              <p style=\"color:#999;font-size:12px;\">If you did not request this, please ignore this email.</p>
            </div>""".formatted(otp);
    }
}

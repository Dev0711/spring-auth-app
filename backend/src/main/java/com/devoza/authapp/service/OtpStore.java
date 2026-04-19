package com.devoza.authapp.service;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory OTP store.
 * Replace with Redis for production multi-instance deployments.
 */
@Component
public class OtpStore {

    private record OtpEntry(String otp, LocalDateTime expiresAt) {}

    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    public void save(String email, String otp, int expiryMinutes) {
        store.put(email.toLowerCase(),
                new OtpEntry(otp, LocalDateTime.now().plusMinutes(expiryMinutes)));
    }

    public boolean isValid(String email, String otp) {
        OtpEntry entry = store.get(email.toLowerCase());
        if (entry == null) return false;
        if (LocalDateTime.now().isAfter(entry.expiresAt())) {
            store.remove(email.toLowerCase());
            return false;
        }
        return entry.otp().equals(otp);
    }

    public void invalidate(String email) {
        store.remove(email.toLowerCase());
    }
}

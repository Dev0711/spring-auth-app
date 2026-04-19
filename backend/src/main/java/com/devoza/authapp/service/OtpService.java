package com.devoza.authapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpStore otpStore;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${app.otp.expiry-minutes:5}")
    private int expiryMinutes;

    @Value("${app.otp.length:6}")
    private int otpLength;

    public String generateAndStore(String email) {
        String otp = generateOtp();
        otpStore.save(email, otp, expiryMinutes);
        return otp;
    }

    public boolean verify(String email, String otp) {
        return otpStore.isValid(email, otp);
    }

    public void invalidate(String email) {
        otpStore.invalidate(email);
    }

    private String generateOtp() {
        int bound = (int) Math.pow(10, otpLength);
        int base  = (int) Math.pow(10, otpLength - 1);
        return String.valueOf(base + RANDOM.nextInt(bound - base));
    }
}

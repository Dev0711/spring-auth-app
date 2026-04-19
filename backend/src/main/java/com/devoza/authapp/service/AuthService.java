package com.devoza.authapp.service;

import com.devoza.authapp.dto.*;
import com.devoza.authapp.entity.User;
import com.devoza.authapp.repository.UserRepository;
import com.devoza.authapp.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final OtpService otpService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public void sendOtp(String email) {
        String otp = otpService.generateAndStore(email);
        emailService.sendOtpEmail(email, otp);
        log.info("OTP sent to: {}", email);
    }

    public AuthResponse verifyOtp(String email, String otp) {
        if (!otpService.verify(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        otpService.invalidate(email);

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createLocalUser(email));

        return AuthResponse.builder()
                .token(jwtUtil.generateToken(user))
                .user(toDto(user))
                .build();
    }

    private User createLocalUser(String email) {
        return userRepository.save(User.builder()
                .email(email).name(email.split("@")[0])
                .provider(User.AuthProvider.LOCAL).emailVerified(true).build());
    }

    private UserDto toDto(User user) {
        return UserDto.builder().id(user.getId()).email(user.getEmail())
                .name(user.getName()).pictureUrl(user.getPictureUrl()).build();
    }
}

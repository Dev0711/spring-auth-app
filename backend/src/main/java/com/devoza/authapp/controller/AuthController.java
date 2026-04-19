package com.devoza.authapp.controller;

import com.devoza.authapp.dto.*;
import com.devoza.authapp.entity.User;
import com.devoza.authapp.repository.UserRepository;
import com.devoza.authapp.service.AuthService;
import com.devoza.authapp.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /** POST /auth/send-otp */
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> sendOtp(@Valid @RequestBody OtpRequest request) {
        authService.sendOtp(request.getEmail());
        return ResponseEntity.ok(new ApiResponse(true, "OTP sent to " + request.getEmail()));
    }

    /** POST /auth/verify-otp */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request.getEmail(), request.getOtp()));
    }

    /** GET /auth/me — requires Bearer token */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserDto.builder().id(user.getId()).email(user.getEmail())
                .name(user.getName()).pictureUrl(user.getPictureUrl()).build());
    }

    /** GET /auth/google/login — documentation endpoint */
    @GetMapping("/google/login")
    public ResponseEntity<ApiResponse> googleLoginInfo() {
        return ResponseEntity.ok(new ApiResponse(true,
                "Redirect your browser to: /oauth2/authorization/google"));
    }
}

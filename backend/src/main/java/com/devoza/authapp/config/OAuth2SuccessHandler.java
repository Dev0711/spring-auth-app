package com.devoza.authapp.config;

import com.devoza.authapp.entity.User;
import com.devoza.authapp.repository.UserRepository;
import com.devoza.authapp.util.JwtUtil;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String pictureUrl = oAuth2User.getAttribute("picture");
        String providerId = oAuth2User.getAttribute("sub");

        log.info("OAuth2 authentication successful for email: {}", email);

        // Ensure user exists in database (fallback if CustomOAuth2UserService didn't work)
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("User not found, creating in success handler: {}", email);
                    User newUser = User.builder()
                            .email(email)
                            .name(name)
                            .pictureUrl(pictureUrl)
                            .provider(User.AuthProvider.GOOGLE)
                            .providerId(providerId)
                            .emailVerified(true)
                            .build();
                    return userRepository.save(newUser);
                });

        String token = jwtUtil.generateToken(user);
        log.info("OAuth2 login successful for user: {} (ID: {})", email, user.getId());

        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/callback")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}

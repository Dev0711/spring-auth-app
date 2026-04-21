package com.devoza.authapp.service;

import com.devoza.authapp.entity.User;
import com.devoza.authapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.core.user.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        log.info("CustomOAuth2UserService.loadUser called");
        
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(request);

        Map<String, Object> attrs = oAuth2User.getAttributes();
        String email      = (String) attrs.get("email");
        String name       = (String) attrs.get("name");
        String pictureUrl = (String) attrs.get("picture");
        String providerId = (String) attrs.get("sub");

        log.info("Processing OAuth2 user: {}", email);

        // Ensure user exists in database
        User user = userRepository.findByEmail(email)
                .map(existing -> updateUser(existing, name, pictureUrl))
                .orElseGet(() -> createUser(email, name, pictureUrl, providerId));

        // Force flush to ensure the user is saved immediately
        userRepository.flush();

        log.info("OAuth2 user processed and saved: {}", email);
        return oAuth2User;
    }

    private User createUser(String email, String name, String picture, String providerId) {
        log.info("Creating new user in database: {}", email);
        User user = User.builder()
                .email(email).name(name).pictureUrl(picture)
                .provider(User.AuthProvider.GOOGLE).providerId(providerId)
                .emailVerified(true).build();
        User savedUser = userRepository.save(user);
        log.info("User created and saved: {} (ID: {})", email, savedUser.getId());
        return savedUser;
    }

    private User updateUser(User user, String name, String picture) {
        log.info("Updating existing user: {}", user.getEmail());
        user.setName(name); 
        user.setPictureUrl(picture);
        User savedUser = userRepository.save(user);
        log.info("User updated: {}", user.getEmail());
        return savedUser;
    }
}

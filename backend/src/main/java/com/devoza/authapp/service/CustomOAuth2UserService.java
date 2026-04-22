package com.devoza.authapp.service;

import com.devoza.authapp.entity.User;
import com.devoza.authapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.core.user.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    // REQUIRES_NEW = start a brand new transaction, commit it fully
    // before returning. This guarantees the user row is visible to
    // OAuth2SuccessHandler which runs in a different thread context.
    @Transactional(propagation = Propagation.REQUIRES_NEW)
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

        userRepository.findByEmail(email)
                .map(existing -> updateUser(existing, name, pictureUrl))
                .orElseGet(() -> createUser(email, name, pictureUrl, providerId));

        // saveAndFlush guarantees an immediate INSERT/UPDATE + commit
        // within this REQUIRES_NEW transaction before we return.
        // OAuth2SuccessHandler will always find this user in the DB.
        log.info("OAuth2 user saved and committed to DB: {}", email);
        return oAuth2User;
    }

    private User createUser(String email, String name, String picture, String providerId) {
        log.info("Creating new OAuth2 user: {}", email);
        User user = User.builder()
                .email(email)
                .name(name)
                .pictureUrl(picture)
                .provider(User.AuthProvider.GOOGLE)
                .providerId(providerId)
                .emailVerified(true)
                .build();
        return userRepository.saveAndFlush(user);  // saveAndFlush = save + flush in one call
    }

    private User updateUser(User user, String name, String picture) {
        log.info("Updating existing OAuth2 user: {}", user.getEmail());
        user.setName(name);
        user.setPictureUrl(picture);
        return userRepository.saveAndFlush(user);
    }
}

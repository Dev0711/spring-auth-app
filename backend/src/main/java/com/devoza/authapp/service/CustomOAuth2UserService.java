package com.devoza.authapp.service;

import com.devoza.authapp.entity.User;
import com.devoza.authapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.core.user.*;
import org.springframework.stereotype.Service;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(request);

        Map<String, Object> attrs = oAuth2User.getAttributes();
        String email      = (String) attrs.get("email");
        String name       = (String) attrs.get("name");
        String pictureUrl = (String) attrs.get("picture");
        String providerId = (String) attrs.get("sub");

        userRepository.findByEmail(email)
                .map(existing -> updateUser(existing, name, pictureUrl))
                .orElseGet(() -> createUser(email, name, pictureUrl, providerId));

        return oAuth2User;
    }

    private User createUser(String email, String name, String picture, String providerId) {
        User user = User.builder()
                .email(email).name(name).pictureUrl(picture)
                .provider(User.AuthProvider.GOOGLE).providerId(providerId)
                .emailVerified(true).build();
        log.info("Creating new Google user: {}", email);
        return userRepository.save(user);
    }

    private User updateUser(User user, String name, String picture) {
        user.setName(name); user.setPictureUrl(picture);
        return userRepository.save(user);
    }
}

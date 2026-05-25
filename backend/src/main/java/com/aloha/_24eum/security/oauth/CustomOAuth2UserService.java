package com.aloha._24eum.security.oauth;

import java.util.Map;
import java.util.UUID;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.aloha._24eum.dao.UserMapper;
import com.aloha._24eum.dto.User;
import com.aloha._24eum.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        OAuth2UserInfo info = OAuth2UserInfoFactory.from(registrationId, attributes);
        User user = upsert(info);

        return new CustomOAuth2User(new CustomUserDetails(user), attributes,
                userRequest.getClientRegistration().getProviderDetails()
                        .getUserInfoEndpoint().getUserNameAttributeName());
    }

    private User upsert(OAuth2UserInfo info) {
        User existing = userMapper.findByProvider(info.getProvider(), info.getProviderId());
        if (existing != null) return existing;

        String email = info.getEmail();
        if (email != null) {
            User byEmail = userMapper.findByEmail(email);
            if (byEmail != null) {
                log.info("기존 이메일 계정에 카카오 연동 처리 필요 (수동): {}", email);
                return byEmail;
            }
        } else {
            email = info.getProvider().toLowerCase() + "_" + info.getProviderId() + "@noemail.local";
        }

        String nickname = info.getName();
        if (nickname == null || nickname.isBlank()) {
            nickname = "kakao_" + info.getProviderId();
        }
        if (userMapper.existsByNickname(nickname)) {
            nickname = nickname + "_" + UUID.randomUUID().toString().substring(0, 6);
        }

        User newUser = User.builder()
                .email(email)
                .nickname(nickname)
                .role("USER")
                .provider(info.getProvider())
                .providerId(info.getProviderId())
                .profileImage(info.getProfileImage())
                .build();
        userMapper.insert(newUser);
        return newUser;
    }

    /** OAuth2User + UserDetails 결합 (인증 컨텍스트에서 양쪽 모두 사용 가능) */
    public static class CustomOAuth2User extends DefaultOAuth2User implements OidcUser {
        private final transient CustomUserDetails details;

        public CustomOAuth2User(CustomUserDetails details, Map<String, Object> attributes, String nameAttributeKey) {
            super(details.getAuthorities(), attributes, nameAttributeKey);
            this.details = details;
        }

        public CustomUserDetails details() { return details; }
        public Long userId() { return details.getId(); }

        @Override public Map<String, Object> getClaims() { return getAttributes(); }
        @Override public org.springframework.security.oauth2.core.oidc.OidcUserInfo getUserInfo() { return null; }
        @Override public org.springframework.security.oauth2.core.oidc.OidcIdToken getIdToken() { return null; }
    }
}

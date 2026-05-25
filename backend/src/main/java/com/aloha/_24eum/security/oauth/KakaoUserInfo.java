package com.aloha._24eum.security.oauth;

import java.util.Map;

public class KakaoUserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;        // kakao 원본 attributes
    private final Map<String, Object> kakaoAccount;      // kakao_account
    private final Map<String, Object> profile;           // kakao_account.profile

    @SuppressWarnings("unchecked")
    public KakaoUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
        this.kakaoAccount = (Map<String, Object>) attributes.getOrDefault("kakao_account", Map.of());
        this.profile = (Map<String, Object>) kakaoAccount.getOrDefault("profile", Map.of());
    }

    @Override public String getProvider() { return "KAKAO"; }

    @Override public String getProviderId() {
        Object id = attributes.get("id");
        return id == null ? null : String.valueOf(id);
    }

    @Override public String getEmail() {
        Object email = kakaoAccount.get("email");
        return email == null ? null : email.toString();
    }

    @Override public String getName() {
        Object nickname = profile.get("nickname");
        return nickname == null ? null : nickname.toString();
    }

    @Override public String getProfileImage() {
        Object img = profile.get("profile_image_url");
        return img == null ? null : img.toString();
    }
}

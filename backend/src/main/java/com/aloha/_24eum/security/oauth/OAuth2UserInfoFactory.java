package com.aloha._24eum.security.oauth;

import java.util.Map;

public class OAuth2UserInfoFactory {

    private OAuth2UserInfoFactory() {}

    public static OAuth2UserInfo from(String registrationId, Map<String, Object> attributes) {
        if ("kakao".equalsIgnoreCase(registrationId)) {
            return new KakaoUserInfo(attributes);
        }
        throw new IllegalArgumentException("지원하지 않는 OAuth2 제공자: " + registrationId);
    }
}

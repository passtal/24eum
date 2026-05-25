package com.aloha._24eum.security.oauth;

public interface OAuth2UserInfo {
    String getProvider();
    String getProviderId();
    String getEmail();
    String getName();
    String getProfileImage();
}

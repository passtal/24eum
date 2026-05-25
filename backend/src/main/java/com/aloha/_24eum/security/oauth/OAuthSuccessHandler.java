package com.aloha._24eum.security.oauth;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.aloha._24eum.security.JwtProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;

    @Value("${app.oauth2.frontend-redirect-uri:http://localhost:5173/oauth/callback}")
    private String frontendRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomOAuth2UserService.CustomOAuth2User custom)) {
            getRedirectStrategy().sendRedirect(request, response, frontendRedirectUri + "?error=invalid_principal");
            return;
        }

        String access = jwtProvider.createAccessToken(custom.details().getUser());
        String refresh = jwtProvider.createRefreshToken(custom.details().getUser());

        String target = frontendRedirectUri
                + "?access=" + URLEncoder.encode(access, StandardCharsets.UTF_8)
                + "&refresh=" + URLEncoder.encode(refresh, StandardCharsets.UTF_8);
        getRedirectStrategy().sendRedirect(request, response, target);
    }
}

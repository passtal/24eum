package com.aloha._24eum.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.aloha._24eum.dao.UserMapper;
import com.aloha._24eum.dto.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email);
        }
        return new CustomUserDetails(user);
    }

    public UserDetails loadUserById(Long id) {
        User user = userMapper.findById(id);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: id=" + id);
        }
        return new CustomUserDetails(user);
    }
}

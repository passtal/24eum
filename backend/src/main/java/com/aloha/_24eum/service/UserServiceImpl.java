package com.aloha._24eum.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha._24eum.dao.UserMapper;
import com.aloha._24eum.dto.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User signup(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }
        if (user.getNickname() == null || user.getNickname().isBlank()) {
            throw new IllegalArgumentException("닉네임은 필수입니다.");
        }
        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw new IllegalArgumentException("비밀번호는 6자 이상이어야 합니다.");
        }
        if (userMapper.existsByEmail(user.getEmail())) {
            throw new IllegalStateException("이미 사용 중인 이메일입니다.");
        }
        if (userMapper.existsByNickname(user.getNickname())) {
            throw new IllegalStateException("이미 사용 중인 닉네임입니다.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) user.setRole("USER");
        if (user.getProvider() == null) user.setProvider("LOCAL");
        userMapper.insert(user);
        user.setPassword(null);
        return user;
    }

    @Override
    public User getById(Long id) { return userMapper.findById(id); }

    @Override
    public User getByEmail(String email) { return userMapper.findByEmail(email); }

    @Override
    @Transactional
    public User updateProfile(User user) {
        User existing = userMapper.findById(user.getId());
        if (existing == null) throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        if (user.getNickname() != null && !user.getNickname().equals(existing.getNickname())
                && userMapper.existsByNickname(user.getNickname())) {
            throw new IllegalStateException("이미 사용 중인 닉네임입니다.");
        }
        userMapper.update(user);
        return userMapper.findById(user.getId());
    }

    @Override
    @Transactional
    public void changePassword(Long id, String oldPassword, String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("비밀번호는 6자 이상이어야 합니다.");
        }
        User user = userMapper.findById(id);
        if (user == null) throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        if (!"LOCAL".equals(user.getProvider())) {
            throw new IllegalStateException("소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.");
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
        }
        userMapper.updatePassword(id, passwordEncoder.encode(newPassword));
    }

    @Override
    @Transactional
    public void delete(Long id) { userMapper.delete(id); }

    @Override
    public boolean isEmailAvailable(String email) { return !userMapper.existsByEmail(email); }

    @Override
    public boolean isNicknameAvailable(String nickname) { return !userMapper.existsByNickname(nickname); }
}

package com.aloha._24eum.service;

import com.aloha._24eum.dto.User;

public interface UserService {
    User signup(User user);
    User getById(Long id);
    User getByEmail(String email);
    User updateProfile(User user);
    void changePassword(Long id, String oldPassword, String newPassword);
    void delete(Long id);
    boolean isEmailAvailable(String email);
    boolean isNicknameAvailable(String nickname);
}

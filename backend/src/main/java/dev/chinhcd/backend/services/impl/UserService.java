package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.RegisterRequest;
import dev.chinhcd.backend.dtos.response.RegisterResponse;
import dev.chinhcd.backend.dtos.response.UserResponse;
import dev.chinhcd.backend.enums.ErrorCode;
import dev.chinhcd.backend.enums.Role;
import dev.chinhcd.backend.exception.ServiceException;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.IUserRepository;
import dev.chinhcd.backend.services.IUserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements IUserService {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public RegisterResponse createRegisterUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) throw new ServiceException(ErrorCode.USER_EXISTED);
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);

        user = userRepository.save(user);
        return new RegisterResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return List.of();
    }

    @Override
    public UserResponse getUserById(Long id) {
        return null;
    }
}

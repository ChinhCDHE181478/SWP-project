package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.RegisterRequest;
import dev.chinhcd.backend.dtos.request.UpdateUserRequest;
import dev.chinhcd.backend.dtos.response.RegisterResponse;
import dev.chinhcd.backend.dtos.response.UserResponse;
import dev.chinhcd.backend.enums.AccountType;
import dev.chinhcd.backend.enums.ErrorCode;
import dev.chinhcd.backend.enums.Role;
import dev.chinhcd.backend.exception.ServiceException;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.IUserRepository;
import dev.chinhcd.backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
        user.setAccountType(AccountType.FREE_COURSE);

        user = userRepository.save(user);
        return new RegisterResponse(user.getId(), user.getUsername());
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapResponse).collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        return mapResponse(user);
    }

    @Override
    public UserResponse getMe() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        var user = userRepository.findByUsername(name)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        return mapResponse(user);
    }

    @Override
    public UserResponse updateUser(UpdateUserRequest request) {
        var user = userRepository.findById(request.id()).orElseThrow(
                () -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        Integer grade = Integer.parseInt(request.grade());
        user.setName(request.name());
        user.setGender(request.gender());
        user.setGrade(grade);
        user.setProvince(request.province());
        user.setDistrict(request.district());
        user.setWard(request.ward());
        user.setEducationLevel(request.educationLevel());
        user.setBirthDate(request.birthDate());
        User updatedUser = userRepository.save(user);
        return mapResponse(updatedUser);
    }

    @Override
    public Boolean isNewUser(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        return user.getName() == null || user.getName().isBlank();
    }

    public UserResponse mapResponse(User user) {
        return UserResponse.builder()
                .birthDate(user.getBirthDate())
                .educationLevel(user.getEducationLevel())
                .email(user.getEmail())
                .gender(user.getGender())
                .grade(user.getGrade())
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .role(user.getRole().name())
                .province(user.getProvince())
                .district(user.getDistrict())
                .ward(user.getWard())
                .accountType(user.getAccountType().name())
                .build();
    }
}

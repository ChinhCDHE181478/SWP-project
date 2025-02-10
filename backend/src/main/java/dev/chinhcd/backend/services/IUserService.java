package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.*;
import dev.chinhcd.backend.dtos.response.*;

import java.util.List;

public interface IUserService {
    RegisterResponse createRegisterUser(RegisterRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);
}

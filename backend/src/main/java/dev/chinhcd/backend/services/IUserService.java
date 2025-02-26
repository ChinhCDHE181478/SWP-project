package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.*;
import dev.chinhcd.backend.dtos.response.*;
import dev.chinhcd.backend.enums.Role;

import java.util.List;

public interface IUserService {
    RegisterResponse createRegisterUser(RegisterRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse getMe();

    UserResponse updateUser(UpdateUserRequest request);

    Boolean isNewUser(String username);

    Boolean requestAddMail(VerifyEmailRequest request);

    Boolean addMail(AddEmailRequest request);

    Boolean requestDeleteMail(Long id);

    Boolean deleteMail(String token);

    Boolean changePassword(ChangePasswordRequest request);

    Boolean requestForgotPassword(String username);

    Boolean resetPassword(ResetPasswordRequest request);

    List<UserResponse> getManager(Role type);

    Boolean deleteUser(Long id);

    Boolean addManager(AddManagerRequest request);

    Boolean adminChangePassUser(ChangePasswordRequest request);

    Boolean changeAccountType(ChangeAccountTypeRequest request);
}

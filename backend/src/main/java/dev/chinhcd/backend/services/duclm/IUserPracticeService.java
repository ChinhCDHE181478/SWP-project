package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.dtos.request.UserRequest;
import dev.chinhcd.backend.dtos.response.UserResponse;

public interface IUserPracticeService {
    public Integer getPracticeInfoByUserId(Long id);
}

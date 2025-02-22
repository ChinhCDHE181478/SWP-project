package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.models.duclm.UserPractice;
import dev.chinhcd.backend.repository.duclm.IUserPracticeRepository;
import dev.chinhcd.backend.services.duclm.impl.UserPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/practice")
@RequiredArgsConstructor
public class UserPracticeController {

    private final UserPracticeService userPracticeService;
    private final IUserPracticeRepository userPracticeRespository;

    @GetMapping("/get-practice-info/{id}")
    public ResponseEntity<Long> getPracticeInfo(@PathVariable Long id) {
        Integer practiceId = userPracticeService.getPracticeInfoByUserId(id);

        if (practiceId == null) {
            UserPractice userPractice = new UserPractice();
            User user = new User();
            user.setId(id);
            Practice practice = new Practice();
            practice.setPracticeId(1);
            userPractice.setUser(user);
            userPractice.setPractice(practice);
            userPracticeRespository.save(userPractice);
            return getPracticeInfo(id);
        }

        return ResponseEntity.ok(Long.valueOf(practiceId));
    }



}

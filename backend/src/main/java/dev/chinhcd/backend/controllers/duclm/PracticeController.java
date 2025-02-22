package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.services.duclm.IPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final IPracticeService practiveService;

    @GetMapping("/max-level")
    public ResponseEntity<Integer> getMaxLevel() {
        return ResponseEntity.ok(practiveService.getMaxLevel());
    }
}

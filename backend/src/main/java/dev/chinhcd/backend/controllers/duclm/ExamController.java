package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.models.duclm.Exam;
import dev.chinhcd.backend.repository.duclm.IExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exam")
@RequiredArgsConstructor
public class ExamController {

    private final IExamRepository iExamRepository;

    @GetMapping("/next")
    public ResponseEntity<?> getNextExam() {
        Exam nextExam = iExamRepository.findNextExam();
        if (nextExam == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No upcoming exams");
        }
        return ResponseEntity.ok(nextExam);
    }
}


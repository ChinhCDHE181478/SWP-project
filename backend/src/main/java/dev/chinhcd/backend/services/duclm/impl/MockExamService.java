package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.models.duclm.MockExam;
import dev.chinhcd.backend.repository.duclm.IMockExamRepository;
import dev.chinhcd.backend.services.duclm.IMockExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MockExamService implements IMockExamService {

    private final IMockExamRepository mockExamRepository;

    @Override
    public List<MockExam> getMockExams(String grade) {
        return mockExamRepository.findAllByGrade(grade);
    }
}

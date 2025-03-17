package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.MockExam;

import java.util.List;

public interface IMockExamService {
    public List<MockExam> getMockExams(String grade);
}

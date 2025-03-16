package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.response.QuestionsResponse;
import dev.chinhcd.backend.dtos.response.duclm.ExamDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.MockExamDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.QuestionDetailResponse;
import dev.chinhcd.backend.enums.AccountType;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.*;
import dev.chinhcd.backend.repository.duclm.*;
import dev.chinhcd.backend.services.IUserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/mock-exam")
@RequiredArgsConstructor
public class MockExamController {

    private final IMockExamRepository mockExamRepository;
    private final IQuestionRepository questionRepository;
    private final IAnswerRepository answerRepository;
    private final IMockExamQuestionRepository examQuestionRepository;
    private final IUserService userService;
    private final IUserMockExamRepository userMockExamRepository;

    @GetMapping("/get-all")
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<MockExam> mockExamPage = mockExamRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("mockExams", mockExamPage.getContent());
        response.put("totalPages", mockExamPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-mock-exam")
    public ResponseEntity<String> uploadMockExam(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "audioZip", required = false) MultipartFile audioZip, // Thêm audioZip tùy chọn
            @RequestParam("examName") String examName,
            @RequestParam("examDate") String examDate,
            @RequestParam("type") String type,
            @RequestParam("grade") String grade) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên

            // Kiểm tra xem kỳ thi đã tồn tại chưa
            if (mockExamRepository.findByExamNameAndGrade(examName, grade).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Mock exam already exists in the system");
            }

            // Tạo và lưu MockExam
            MockExam mockExam = new MockExam();
            mockExam.setExamName(examName);
            mockExam.setExamDate(Date.valueOf(examDate));
            mockExam.setType(type);
            mockExam.setGrade(grade);
            mockExamRepository.save(mockExam);

            String folderPath = "C:\\Users\\Chinh\\OneDrive\\Desktop\\mockexams\\" + mockExam.getMockExamId();
            Path targetDir = Paths.get(folderPath);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // Lưu file Excel
            Path excelFilePath = targetDir.resolve("mockexam_" + mockExam.getMockExamId() + ".xlsx");
            Files.copy(file.getInputStream(), excelFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Nếu có file ZIP, lưu và giải nén
            if (audioZip != null && !audioZip.isEmpty()) {
                Path zipFilePath = targetDir.resolve("audio_" + mockExam.getMockExamId() + ".zip");
                Files.copy(audioZip.getInputStream(), zipFilePath, StandardCopyOption.REPLACE_EXISTING);

                // Giải nén file ZIP
                unzipFile(zipFilePath.toString(), folderPath);
            }

            // Duyệt file Excel để tạo Questions và Answers
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) { // Bắt đầu từ hàng thứ hai
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // Tạo Question
                Question question = new Question();
                question.setQuestionText(getStringCellValue(row.getCell(0))); // Câu hỏi
                question.setChoice1(getStringCellValue(row.getCell(1))); // Lựa chọn 1
                question.setChoice2(getStringCellValue(row.getCell(2))); // Lựa chọn 2
                question.setChoice3(getStringCellValue(row.getCell(3))); // Lựa chọn 3
                question.setChoice4(getStringCellValue(row.getCell(4))); // Lựa chọn 4
                String audioFileName = getStringCellValue(row.getCell(5)); // Giả sử cột âm thanh ở vị trí 5
                if (audioFileName != null && !audioFileName.isEmpty()) {
                    Path audioFilePath = targetDir.resolve(audioFileName);
                    if (Files.exists(audioFilePath)) {
                        question.setAudioFile(Files.readAllBytes(audioFilePath)); // Lưu tệp âm thanh
                    } else {
                        question.setAudioFile(null);
                    }
                } else {
                    question.setAudioFile(null);
                }

                questionRepository.save(question);

                // Liên kết với MockExam
                MockExamQuestion examQuestion = new MockExamQuestion();
                examQuestion.setMockExam(mockExam);
                examQuestion.setQuestion(question);
                examQuestionRepository.save(examQuestion);

                // Tạo Answer
                Answer answer = new Answer();
                answer.setCorrectAnswer(getStringCellValue(row.getCell(6))); // Đáp án đúng
                answer.setQuestion(question);
                answerRepository.save(answer);
            }
            return ResponseEntity.ok("Mock exam data has been saved");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }

    @PutMapping("/update/{mockExamId}")
    @Transactional
    public ResponseEntity<String> updateMockExam(
            @PathVariable Long mockExamId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "audioZip", required = false) MultipartFile audioZip, // Thêm audioZip tùy chọn
            @RequestParam("examName") String examName,
            @RequestParam("examDate") String examDate,
            @RequestParam("type") String type,
            @RequestParam("grade") String grade) {

        try {
            Optional<MockExam> mockExamOptional = mockExamRepository.findById(Math.toIntExact(mockExamId));
            if (mockExamOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mock exam not found!");
            }

            MockExam mockExam = mockExamOptional.get();
            mockExam.setExamName(examName);
            mockExam.setExamDate(Date.valueOf(examDate));
            mockExam.setType(type);
            mockExam.setGrade(grade);
            mockExamRepository.save(mockExam); // Cập nhật MockExam

            String folderPath = "C:\\Users\\Chinh\\OneDrive\\Desktop\\mockexams\\" + mockExam.getMockExamId();
            Path targetDir = Paths.get(folderPath);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // Lưu file Excel
            Path excelFilePath = targetDir.resolve("mockexam_" + mockExam.getMockExamId() + ".xlsx");
            Files.copy(file.getInputStream(), excelFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Nếu có file ZIP, lưu và giải nén
            if (audioZip != null && !audioZip.isEmpty()) {
                Path zipFilePath = targetDir.resolve("audio_" + mockExam.getMockExamId() + ".zip");
                Files.copy(audioZip.getInputStream(), zipFilePath, StandardCopyOption.REPLACE_EXISTING);

                // Giải nén file ZIP
                unzipFile(zipFilePath.toString(), folderPath);
            }

            // Xóa dữ liệu cũ
            List<Question> questionsToDelete = questionRepository.findByMockExamId(mockExamId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }

            // Đọc file Excel để cập nhật dữ liệu mới
            try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);

                for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    // Tạo Question mới
                    Question question = new Question();
                    question.setQuestionText(getStringCellValue(row.getCell(0)));
                    question.setChoice1(getStringCellValue(row.getCell(1)));
                    question.setChoice2(getStringCellValue(row.getCell(2)));
                    question.setChoice3(getStringCellValue(row.getCell(3)));
                    question.setChoice4(getStringCellValue(row.getCell(4)));

                    // Lưu tệp âm thanh nếu có
                    String audioFileName = getStringCellValue(row.getCell(5)); // Giả sử cột âm thanh ở vị trí 5
                    if (audioFileName != null && !audioFileName.isEmpty()) {
                        Path audioFilePath = targetDir.resolve(audioFileName);
                        if (Files.exists(audioFilePath)) {
                            question.setAudioFile(Files.readAllBytes(audioFilePath)); // Lưu tệp âm thanh
                        } else {
                            question.setAudioFile(null);
                        }
                    } else {
                        question.setAudioFile(null);
                    }

                    questionRepository.save(question);

                    // Liên kết Question với MockExam
                    MockExamQuestion examQuestion = new MockExamQuestion();
                    examQuestion.setMockExam(mockExam);
                    examQuestion.setQuestion(question);
                    examQuestionRepository.save(examQuestion);

                    // Tạo Answer mới
                    Answer answer = new Answer();
                    answer.setCorrectAnswer(getStringCellValue(row.getCell(6)));
                    answer.setQuestion(question);
                    answerRepository.save(answer);
                }
            }

            // Xử lý audioZip nếu có
            if (audioZip != null && !audioZip.isEmpty()) {
                if (!Files.exists(targetDir)) {
                    Files.createDirectories(targetDir);
                }
                try (ZipInputStream zis = new ZipInputStream(audioZip.getInputStream())) {
                    ZipEntry zipEntry;
                    while ((zipEntry = zis.getNextEntry()) != null) {
                        File newFile = new File(targetDir.toFile(), zipEntry.getName());
                        if (zipEntry.isDirectory()) {
                            newFile.mkdirs();
                        } else {
                            // Ngăn chặn việc vượt quá đường dẫn
                            if (zipEntry.getName().contains("..")) {
                                return ResponseEntity.badRequest().body("Invalid file path in zip");
                            }
                            new File(newFile.getParent()).mkdirs();
                            Files.copy(zis, newFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                        }
                    }
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Failed to process audio zip: " + e.getMessage());
                }
            }

            return ResponseEntity.ok("Mock exam updated successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating mock exam: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{mockExamId}")
    @Transactional
    public ResponseEntity<String> deleteMockExam(@PathVariable Long mockExamId) {
        try {
            Optional<MockExam> mockExamOptional = mockExamRepository.findById(Math.toIntExact(mockExamId));
            if (mockExamOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mock exam not found!");
            }

            MockExam mockExam = mockExamOptional.get();

            // Xóa tất cả câu hỏi liên quan đến mock exam
            List<Question> questionsToDelete = questionRepository.findByMockExamId(mockExamId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }

            mockExamRepository.delete(mockExam);

            return ResponseEntity.ok("Mock exam and all related data deleted successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting mock exam: " + e.getMessage());
        }
    }

    private String getStringCellValue(Cell cell) {
        return cell != null ? cell.toString().trim() : "";
    }

    @GetMapping("/get-detail/{id}")
    public ResponseEntity<?> getMockExamDetail(@PathVariable Long id) {
        MockExam mockExam = mockExamRepository.findById(Math.toIntExact(id)).orElse(null);
        if (mockExam == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mock exam does not exist");
        }

        List<MockExamQuestion> examQuestions = examQuestionRepository.findByMockExam(mockExam);
        List<QuestionDetailResponse> questionDetails = new ArrayList<>();

        for (MockExamQuestion examQuestion : examQuestions) {
            Question question = examQuestion.getQuestion();
            if (question != null) {
                Answer answer = answerRepository.findByQuestion(question);
                QuestionDetailResponse questionDetail = new QuestionDetailResponse(question, answer);
                questionDetails.add(questionDetail);
            }
        }

        // Định dạng ngày thi
        String examDate = new SimpleDateFormat("yyyy-MM-dd").format(mockExam.getExamDate());
        int grade = Integer.parseInt(mockExam.getGrade());

        // Tạo đối tượng MockExamDetailResponse
        MockExamDetailResponse response = new MockExamDetailResponse(
                mockExam.getMockExamId(),
                mockExam.getExamName(),
                examDate,
                grade,
                mockExam.getType(),
                questionDetails
        );

        return ResponseEntity.ok(response);
    }
    private void unzipFile(String zipFilePath, String destDir) throws IOException {
        File dir = new File(destDir);
        if (!dir.exists()) dir.mkdirs();

        try (ZipInputStream zipIn = new ZipInputStream(new FileInputStream(zipFilePath))) {
            ZipEntry entry;
            while ((entry = zipIn.getNextEntry()) != null) {
                Path filePath = Paths.get(destDir, entry.getName());
                if (!entry.isDirectory()) {
                    Files.copy(zipIn, filePath, StandardCopyOption.REPLACE_EXISTING);
                } else {
                    Files.createDirectories(filePath);
                }
                zipIn.closeEntry();
            }
        }
    }

    @GetMapping("/download-excel/{mockexamID}")
    public ResponseEntity<Resource> downloadExcel(@PathVariable Integer mockexamID) {
        try {
            // Lấy bài thực hành từ database để xác định đường dẫn
            MockExam mockExam = mockExamRepository.findById(mockexamID).orElse(null);
            if (mockExam == null) {
                return ResponseEntity.notFound().build();
            }

            // Đường dẫn đến file Excel
            String folderPath = "C:\\Users\\Chinh\\OneDrive\\Desktop\\mockexams\\" + mockexamID;
            Path filePath = Paths.get(folderPath, "mockexam_" + mockexamID + ".xlsx");

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // API để tải file audio cho bài thực hành
    @GetMapping("/download-audio/{mockexamID}")
    public ResponseEntity<Resource> downloadAudio(@PathVariable Integer mockexamID) {
        try {
            // Lấy bài thực hành từ database để xác định đường dẫn
            MockExam mockExam = mockExamRepository.findById(mockexamID).orElse(null);
            if (mockExam == null) {
                return ResponseEntity.notFound().build();
            }

            // Đường dẫn đến file audio
            String folderPath = "C:\\Users\\Chinh\\OneDrive\\Desktop\\mockexams\\" + mockexamID; // Đường dẫn thư mục
            Path filePath = Paths.get(folderPath, "audio_" + mockexamID + ".zip"); // Hoặc .rar

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/allow-do-exam")
    public ResponseEntity<Boolean> doExam(@RequestParam Long userId) {
        User user = userService.getUserById(userId);
        if(user.getAccountType().equals(AccountType.FREE_COURSE)) {
            return ResponseEntity.ok(false);
        } else if (user.getAccountType().equals(AccountType.COMBO_COURSE)) {
            return ResponseEntity.ok(true);
        }

        int month = LocalDate.now().getMonthValue();
        if (userMockExamRepository.findByMonthAndUserId(month, userId).size() < 5) {
            return ResponseEntity.ok(true);
        }

        return ResponseEntity.ok(false);
    }

    @GetMapping("/get-question")
    public ResponseEntity<List<QuestionsResponse>> getQuestions(@RequestParam Long examId) {
        List<Question> ques = questionRepository.findByMockExamId(examId);
        List<QuestionsResponse> quesRes = ques.stream().map(q -> {
            return QuestionsResponse.builder()
                    .questionId(q.getQuestionId())
                    .questionText(q.getQuestionText())
                    .choice4(q.getChoice4())
                    .choice3(q.getChoice3())
                    .choice2(q.getChoice2())
                    .choice1(q.getChoice1())
                    .audioFile(q.getAudioFile())
                    .build();
        }).collect(Collectors.toList());
        return ResponseEntity.ok(quesRes);
    }
}
package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.response.duclm.ExamDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.QuestionDetailResponse;
import dev.chinhcd.backend.models.duclm.*;
import dev.chinhcd.backend.repository.duclm.*;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import lombok.RequiredArgsConstructor;
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/exam")
@RequiredArgsConstructor
public class ExamController {

    private final IExamRepository examRepository;
    private final IQuestionRepository questionRepository;
    private final IAnswerRepository answerRepository;
    private final IExamQuestionRepository examQuestionRepository;

    @GetMapping("/next")
    public ResponseEntity<?> getNextExam() {
        Exam nextExam = examRepository.findNextExam();
        if (nextExam == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No upcoming exams");
        }
        return ResponseEntity.ok(nextExam);
    }

    @GetMapping("/get-all")
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Exam> examPage = examRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("exams", examPage.getContent());
        response.put("totalPages", examPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-exam")
    public ResponseEntity<String> uploadExam(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "audioZip", required = false) MultipartFile audioZip,
            @RequestParam("examName") String examName,
            @RequestParam("examStart") String examStart,
            @RequestParam("examEnd") String examEnd,
            @RequestParam("grade") int grade,
            @RequestParam("status") String status) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Tệp rỗng");
        }

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            // Kiểm tra xem kỳ thi đã tồn tại chưa
            if (examRepository.findByExamNameAndGrade(examName, grade).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Kỳ thi đã tồn tại trong hệ thống");
            }

            // Tạo và lưu Exam
            Exam exam = new Exam();
            exam.setExamName(examName);
            exam.setExamStart(LocalDateTime.parse(examStart));
            exam.setExamEnd(LocalDateTime.parse(examEnd));
            exam.setGrade(grade);
            exam.setStatus(status);
            examRepository.save(exam);

            // Tạo thư mục lưu trữ cho kỳ thi
            String folderPath = "C:\\Users\\Minh Duc\\Desktop\\exams\\" + exam.getExamId();
            Path targetDir = Paths.get(folderPath);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // Lưu file Excel
            Path excelFilePath = targetDir.resolve("exam_" + exam.getExamId() + ".xlsx");
            Files.copy(file.getInputStream(), excelFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Nếu có file ZIP, lưu và giải nén
            if (audioZip != null && !audioZip.isEmpty()) {
                Path zipFilePath = targetDir.resolve("audio_" + exam.getExamId() + ".zip");
                Files.copy(audioZip.getInputStream(), zipFilePath, StandardCopyOption.REPLACE_EXISTING);

                // Giải nén file ZIP
                unzipFile(zipFilePath.toString(), folderPath);
            }

            // Duyệt file Excel để tạo Questions và Answers
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // Tạo Question
                Question question = new Question();
                question.setQuestionText(getStringCellValue(row.getCell(0)));
                question.setChoice1(getStringCellValue(row.getCell(1)));
                question.setChoice2(getStringCellValue(row.getCell(2)));
                question.setChoice3(getStringCellValue(row.getCell(3)));
                question.setChoice4(getStringCellValue(row.getCell(4)));

                // Lấy file âm thanh từ thư mục giải nén
                String audioFileName = getStringCellValue(row.getCell(5));
                if (audioFileName != null && !audioFileName.isEmpty()) {
                    Path audioFilePath = targetDir.resolve(audioFileName);
                    if (Files.exists(audioFilePath)) {
                        question.setAudioFile(Files.readAllBytes(audioFilePath));
                    } else {
                        question.setAudioFile(null);
                    }
                }

                questionRepository.save(question);

                // Liên kết với Exam
                ExamQuestion examQuestion = new ExamQuestion();
                examQuestion.setExam(exam);
                examQuestion.setQuestion(question);
                examQuestionRepository.save(examQuestion);

                // Tạo Answer
                Answer answer = new Answer();
                answer.setCorrectAnswer(getStringCellValue(row.getCell(6)));
                answer.setQuestion(question);
                answerRepository.save(answer);
            }

            return ResponseEntity.ok("Dữ liệu kỳ thi đã được lưu");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xử lý tệp: " + e.getMessage());
        }
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


    @PutMapping("/update/{examId}")
    @Transactional
    public ResponseEntity<String> updateExam(
            @PathVariable Long examId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "audioZip", required = false) MultipartFile audioZip,
            @RequestParam("examName") String examName,
            @RequestParam("examStart") String examStart,
            @RequestParam("examEnd") String examEnd,
            @RequestParam("grade") int grade,
            @RequestParam("status") String status) {

        try {
            Optional<Exam> examOptional = examRepository.findById(Math.toIntExact(examId));
            if (examOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy kỳ thi!");
            }

            Exam exam = examOptional.get();
            exam.setExamName(examName);
            exam.setExamStart(LocalDateTime.parse(examStart));
            exam.setExamEnd(LocalDateTime.parse(examEnd));
            exam.setGrade(grade);
            exam.setStatus(status);
            examRepository.save(exam); // Cập nhật Exam

            // Tạo thư mục cho exam
            String folderPath = "C:\\Users\\Minh Duc\\Desktop\\exams\\" + exam.getExamId();
            Path targetDir = Paths.get(folderPath);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // Lưu file Excel
            String excelFileName = "exam_" + exam.getExamId() + ".xlsx";
            Path excelFilePath = targetDir.resolve(excelFileName);
            Files.copy(file.getInputStream(), excelFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Xóa dữ liệu cũ
            List<Question> questionsToDelete = questionRepository.findByExamId(examId);
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
                    String audioFileName = getStringCellValue(row.getCell(5));
                    if (audioFileName != null && !audioFileName.isEmpty()) {
                        Path audioFilePath = targetDir.resolve(audioFileName);
                        if (Files.exists(audioFilePath)) {
                            question.setAudioFile(Files.readAllBytes(audioFilePath));
                        } else {
                            question.setAudioFile(null);
                        }
                    } else {
                        question.setAudioFile(null);
                    }

                    questionRepository.save(question);

                    // Liên kết Question với Exam
                    ExamQuestion examQuestion = new ExamQuestion();
                    examQuestion.setExam(exam);
                    examQuestion.setQuestion(question);
                    examQuestionRepository.save(examQuestion);

                    // Tạo Answer mới
                    Answer answer = new Answer();
                    answer.setCorrectAnswer(getStringCellValue(row.getCell(6)));
                    answer.setQuestion(question);
                    answerRepository.save(answer);
                }
            }

            // Giải nén file audioZip nếu có
            if (audioZip != null && !audioZip.isEmpty()) {
                Path zipFilePath = targetDir.resolve("audio_" + exam.getExamId() + ".zip");

                try {
                    // Xóa file ZIP cũ nếu tồn tại
                    if (Files.exists(zipFilePath)) {
                        Files.delete(zipFilePath);
                    }

                    // Ghi file ZIP mới
                    Files.copy(audioZip.getInputStream(), zipFilePath, StandardCopyOption.REPLACE_EXISTING);

                    // Đảm bảo file ZIP đã được lưu trước khi giải nén
                    if (Files.exists(zipFilePath) && Files.size(zipFilePath) > 0) {
                        System.out.println("ZIP file saved: " + zipFilePath.toString());

                        // Giải nén vào thư mục exam
                        unzipFile(zipFilePath.toString(), folderPath);
                        System.out.println("ZIP file extracted to: " + folderPath);
                    } else {
                        System.err.println("Lỗi khi lưu file ZIP! File không tồn tại hoặc rỗng.");
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Lỗi khi lưu file ZIP.");
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Lỗi khi xử lý file ZIP: " + e.getMessage());
                }
            }



            return ResponseEntity.ok("Cập nhật kỳ thi thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật kỳ thi: " + e.getMessage());
        }
    }


    @DeleteMapping("/delete/{examId}")
    @Transactional
    public ResponseEntity<String> deleteExam(@PathVariable Long examId) {
        try {
            Optional<Exam> examOptional = examRepository.findById(Math.toIntExact(examId));
            if (examOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy kỳ thi!");
            }

            Exam exam = examOptional.get();

            // Xóa tất cả câu hỏi liên quan đến kỳ thi
            List<Question> questionsToDelete = questionRepository.findByExamId(examId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }

            examRepository.delete(exam);

            return ResponseEntity.ok("Xóa kỳ thi và tất cả dữ liệu liên quan thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa kỳ thi: " + e.getMessage());
        }
    }

    private String getStringCellValue(Cell cell) {
        return cell != null ? cell.toString().trim() : "";
    }

    @GetMapping("/get-detail/{id}")
    public ResponseEntity<?> getExamDetail(@PathVariable Long id) {
        Exam exam = examRepository.findById(Math.toIntExact(id)).orElse(null);
        if (exam == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kỳ thi không tồn tại");
        }

        List<ExamQuestion> examQuestions = examQuestionRepository.findByExam(exam);
        List<QuestionDetailResponse> questionDetails = new ArrayList<>();

        for (ExamQuestion examQuestion : examQuestions) {
            Question question = examQuestion.getQuestion();
            if (question != null) {
                Answer answer = answerRepository.findByQuestion(question);
                QuestionDetailResponse questionDetail = new QuestionDetailResponse(question, answer);
                questionDetails.add(questionDetail);
            }
        }

        // Chuyển đổi LocalDateTime sang String
        String examStart = exam.getExamStart().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String examEnd = exam.getExamEnd().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        // Tạo đối tượng ExamDetailResponse
        ExamDetailResponse response = new ExamDetailResponse(
                exam.getExamId(),
                exam.getExamName(),
                examStart,
                examEnd,
                exam.getGrade(),
                exam.getStatus(),
                questionDetails
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download-excel/{examId}")
    public ResponseEntity<Resource> downloadExcel(@PathVariable Long examId) {
        try {
            // Lấy kỳ thi từ database để xác định đường dẫn
            Exam exam = examRepository.findById(Math.toIntExact(examId)).orElse(null);
            if (exam == null) {
                return ResponseEntity.notFound().build();
            }

            // Đường dẫn đến file Excel
            String folderPath = "C:\\Users\\Minh Duc\\Desktop\\exams\\" + examId; // Đường dẫn thư mục
            Path filePath = Paths.get(folderPath, "exam_" + examId + ".xlsx");

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

    @GetMapping("/download-audio/{examId}")
    public ResponseEntity<Resource> downloadAudio(@PathVariable Long examId) {
        try {
            // Lấy kỳ thi từ database để xác định đường dẫn
            Exam exam = examRepository.findById(Math.toIntExact(examId)).orElse(null);
            if (exam == null) {
                return ResponseEntity.notFound().build();
            }

            // Đường dẫn đến file audio
            String folderPath = "C:\\Users\\Minh Duc\\Desktop\\exams\\" + examId; // Đường dẫn thư mục
            Path filePath = Paths.get(folderPath, "audio_" + examId + ".zip"); // Hoặc .rar

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
}
package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.response.duclm.PracticeDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.QuestionDetailResponse;
import dev.chinhcd.backend.dtos.response.duclm.SmallPracticeDetailResponse;
import dev.chinhcd.backend.models.duclm.*;
import dev.chinhcd.backend.repository.duclm.*;
import dev.chinhcd.backend.services.duclm.IPracticeService;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.*;
import java.sql.Date;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final IPracticeService practiceService;
    private final IPracticeRepository practiceRepository;
    private final ISmallPracticeQuestionRepository smallPracticeQuestionRepository;
    private final ISmallPracticeRepository smallPracticeRepository;
    private final IQuestionRepository questionRepository;
    private final IAnswerRepository answerRepository;
    private final IUserPracticeRepository userPracticeRepository;
    private final ITestResultRepository testResultRepository;

    @GetMapping("/max-level")
    public ResponseEntity<Integer> getMaxLevel() {
        return ResponseEntity.ok(practiceService.getMaxLevel());
    }

    @GetMapping("/get-all")
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "7") int pageSize) {

        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Practice> practicePage = practiceRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("practices", practicePage.getContent());
        response.put("totalPages", practicePage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-practice")
    public ResponseEntity<String> uploadPractice(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "audioZip", required = false) MultipartFile audioZip,
            @RequestParam("practiceDate") String practiceDate,
            @RequestParam("grade") int grade,
            @RequestParam("practiceLevel") int practiceLevel,
            @RequestParam("status") String status) { // Thêm tham số status

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Tệp rỗng");
        }

        try {
            // Create and save Practice
            Practice practice = new Practice();
            try {
                practice.setPracticeDate(Date.valueOf(practiceDate));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid date format");
            }
            practice.setGrade(grade);
            practice.setPracticeLevel(practiceLevel);
            practice.setStatus(status); // Gán giá trị status

            if (practiceRepository.findByPracticeLevelAndGrade(practiceLevel, grade).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Dữ liệu đã tồn tại trong hệ thống");
            }
            practiceRepository.save(practice); // Save Practice to get ID

            String folderPath = "C:\\Users\\Minh Duc\\Desktop\\practices\\" + practice.getPracticeId();
            Path targetDir = Paths.get(folderPath);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // Lưu file Excel
            Path excelFilePath = targetDir.resolve("practice_" + practice.getPracticeId() + ".xlsx");
            Files.copy(file.getInputStream(), excelFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Nếu có file ZIP, lưu và giải nén
            if (audioZip != null && !audioZip.isEmpty()) {
                Path zipFilePath = targetDir.resolve("audio_" + practice.getPracticeId() + ".zip");
                Files.copy(audioZip.getInputStream(), zipFilePath, StandardCopyOption.REPLACE_EXISTING);

                // Giải nén file ZIP
                unzipFile(zipFilePath.toString(), folderPath);
            }


            // Process the Excel file
            try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);

                for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) { // Start from the second row
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    SmallPractice smallPractice = new SmallPractice();
                    smallPractice.setTestName(getStringCellValue(row.getCell(1))); // Test Name
                    smallPractice.setTestDate(row.getCell(0) != null ? row.getCell(0).getDateCellValue() : null); // Test Date
                    smallPractice.setPractice(practice);
                    smallPracticeRepository.save(smallPractice);

                    Question question = new Question();
                    question.setQuestionText(getStringCellValue(row.getCell(2))); // Question
                    question.setChoice1(getStringCellValue(row.getCell(3))); // Choice1
                    question.setChoice2(getStringCellValue(row.getCell(4))); // Choice2
                    question.setChoice3(getStringCellValue(row.getCell(5))); // Choice3
                    question.setChoice4(getStringCellValue(row.getCell(6))); // Choice4

                    String audioFileName = getStringCellValue(row.getCell(8)); // AudioFileName column
                    if (audioFileName != null && !audioFileName.isEmpty()) {
                        Path audioFilePath = targetDir.resolve(audioFileName);
                        if (Files.exists(audioFilePath)) {
                            question.setAudioFile(Files.readAllBytes(audioFilePath)); // Lưu tệp âm thanh
                        } else {
                            question.setAudioFile(null); // Hoặc có thể không lưu tệp âm thanh
                        }
                    } else {
                        question.setAudioFile(null); // Đặt là null nếu không có tệp âm thanh
                    }

                    questionRepository.save(question);

                    SmallPracticeQuestion smallPracticeQuestion = new SmallPracticeQuestion();
                    smallPracticeQuestion.setSmallPractice(smallPractice);
                    smallPracticeQuestion.setQuestion(question);
                    smallPracticeQuestionRepository.save(smallPracticeQuestion);

                    Answer answer = new Answer();
                    answer.setCorrectAnswer(getStringCellValue(row.getCell(7))); // Get the correct answer
                    answer.setQuestion(question);
                    answerRepository.save(answer);
                }
            }

            return ResponseEntity.ok("Dữ liệu đã được lưu");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lưu dữ liệu: " + e.getMessage());
        }
    }

    private String getStringCellValue(Cell cell) {
        if (cell == null) {
            return ""; // Trả về chuỗi rỗng nếu ô là null
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return ""; // Trả về chuỗi rỗng cho các loại ô khác
        }
    }

    @DeleteMapping("/delete/{practiceId}")
    @Transactional
    public ResponseEntity<String> deletePractice(@PathVariable Long practiceId) {
        try {
            Optional<Practice> practiceOptional = practiceRepository.findById(practiceId);
            if (practiceOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bài thực hành!");
            }

            Practice practice = practiceOptional.get();

            List<Question> questionsToDelete = questionRepository.findByPracticeId(practiceId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }

            List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice(practice);
            smallPracticeRepository.deleteAll(smallPractices);

            practiceRepository.delete(practice);

            return ResponseEntity.ok("Xóa thành công bài thực hành và tất cả dữ liệu liên quan!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa bài thực hành: " + e.getMessage());
        }
    }

    @PutMapping("/update/{practiceId}")
    @Transactional
    public ResponseEntity<String> updatePractice(
            @PathVariable Long practiceId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "audioZip", required = false) MultipartFile audioZip,
            @RequestParam("practiceDate") String practiceDate,
            @RequestParam("grade") int grade,
            @RequestParam("practiceLevel") int practiceLevel,
            @RequestParam("status") String status) { // Thêm tham số status

        try {
            Optional<Practice> practiceOptional = practiceRepository.findById(practiceId);
            if (practiceOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bài thực hành!");
            }

            Practice practice = practiceOptional.get();
            practice.setPracticeDate(Date.valueOf(practiceDate));
            practice.setGrade(grade);
            practice.setPracticeLevel(practiceLevel);
            practice.setStatus(status); // Cập nhật giá trị status
            practiceRepository.save(practice); // Cập nhật Practice

            String folderPath = "C:\\Users\\Minh Duc\\Desktop\\practices\\" + practice.getPracticeId();
            Path targetDir = Paths.get(folderPath);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // Lưu file Excel
            Path excelFilePath = targetDir.resolve("exam_" + practice.getPracticeId() + ".xlsx");
            Files.copy(file.getInputStream(), excelFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Nếu có file ZIP, lưu và giải nén
            if (audioZip != null && !audioZip.isEmpty()) {
                Path zipFilePath = targetDir.resolve("audio_" + practice.getPracticeId() + ".zip");
                Files.copy(audioZip.getInputStream(), zipFilePath, StandardCopyOption.REPLACE_EXISTING);

                // Giải nén file ZIP
                unzipFile(zipFilePath.toString(), folderPath);
            }

            // Xóa các câu hỏi và bài thực hành nhỏ cũ
            List<Question> questionsToDelete = questionRepository.findByPracticeId(practiceId);
            if (!questionsToDelete.isEmpty()) {
                questionRepository.deleteAll(questionsToDelete);
            }
            List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice(practice);
            smallPracticeRepository.deleteAll(smallPractices);

            // Xử lý file Excel
            try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);
                for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    // Tạo SmallPractice mới
                    SmallPractice smallPractice = new SmallPractice();
                    smallPractice.setTestName(getStringCellValue(row.getCell(1)));
                    smallPractice.setTestDate(row.getCell(0).getDateCellValue());
                    smallPractice.setPractice(practice);
                    smallPracticeRepository.save(smallPractice);

                    // Tạo Question mới
                    Question question = new Question();
                    question.setQuestionText(getStringCellValue(row.getCell(2)));
                    question.setChoice1(getStringCellValue(row.getCell(3)));
                    question.setChoice2(getStringCellValue(row.getCell(4)));
                    question.setChoice3(getStringCellValue(row.getCell(5)));
                    question.setChoice4(getStringCellValue(row.getCell(6)));

                    questionRepository.save(question);

                    // Liên kết Question với SmallPractice
                    SmallPracticeQuestion smallPracticeQuestion = new SmallPracticeQuestion();
                    smallPracticeQuestion.setSmallPractice(smallPractice);
                    smallPracticeQuestion.setQuestion(question);
                    smallPracticeQuestionRepository.save(smallPracticeQuestion);

                    // Tạo Answer mới
                    Answer answer = new Answer();
                    answer.setCorrectAnswer(getStringCellValue(row.getCell(7)));
                    answer.setQuestion(question);
                    answerRepository.save(answer);
                }
            }
            return ResponseEntity.ok("Cập nhật thành công!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật bài thực hành: " + e.getMessage());
        }
    }

    @GetMapping("/get-detail/{id}")
    public ResponseEntity<?> getPracticeDetail(@PathVariable Long id) {
        Practice practice = practiceRepository.findById(id).orElse(null);
        if (practice == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Practice không tồn tại");
        }

        List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice(practice);
        List<SmallPracticeDetailResponse> practiceDetails = new ArrayList<>();

        for (SmallPractice smallPractice : smallPractices) {
            List<SmallPracticeQuestion> smallPracticeQuestions = smallPracticeQuestionRepository.findBySmallPractice(smallPractice);
            List<QuestionDetailResponse> questionDetails = new ArrayList<>();

            for (SmallPracticeQuestion smallPracticeQuestion : smallPracticeQuestions) {
                Question question = smallPracticeQuestion.getQuestion();
                if (question != null) {
                    Answer answer = answerRepository.findByQuestion(question);
                    QuestionDetailResponse questionDetail = new QuestionDetailResponse(question, answer);
                    questionDetails.add(questionDetail);
                }
            }

            SmallPracticeDetailResponse practiceDetail = new SmallPracticeDetailResponse(smallPractice.getTestName(), questionDetails);
            practiceDetails.add(practiceDetail);
        }

        PracticeDetailResponse response = new PracticeDetailResponse(practice, practiceDetails);
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

    @GetMapping("/download-excel/{practiceId}")
    public ResponseEntity<Resource> downloadExcel(@PathVariable Long practiceId) {
        try {
            // Lấy bài thực hành từ database để xác định đường dẫn
            Practice practice = practiceRepository.findById(practiceId).orElse(null);
            if (practice == null) {
                return ResponseEntity.notFound().build();
            }

            // Đường dẫn đến file Excel
            String folderPath = "C:\\Users\\Minh Duc\\Desktop\\practices\\" + practiceId;
            Path filePath = Paths.get(folderPath, "practice_" + practiceId + ".xlsx");

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
    @GetMapping("/download-audio/{practiceId}")
    public ResponseEntity<Resource> downloadAudio(@PathVariable Long practiceId) {
        try {
            // Lấy bài thực hành từ database để xác định đường dẫn
            Practice practice = practiceRepository.findById(practiceId).orElse(null);
            if (practice == null) {
                return ResponseEntity.notFound().build();
            }

            // Đường dẫn đến file audio
            String folderPath = "C:\\Users\\Minh Duc\\Desktop\\practices\\" + practiceId; // Đường dẫn thư mục
            Path filePath = Paths.get(folderPath, "audio_" + practiceId + ".zip"); // Hoặc .rar

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
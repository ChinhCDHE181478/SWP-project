package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.request.FeedbackRequest;
import dev.chinhcd.backend.services.IFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feedback")
public class FeedbackController {
    private final IFeedbackService feedbackService;

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/send")
    public ResponseEntity<Boolean> sendFeedback(@RequestBody FeedbackRequest feedback) {
        return ResponseEntity.ok(feedbackService.sendFeedback(feedback));
    }
}

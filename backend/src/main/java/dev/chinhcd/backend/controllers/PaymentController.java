package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.request.PaymentRequest;
import dev.chinhcd.backend.dtos.request.PaymentSuccessRequest;
import dev.chinhcd.backend.services.IPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final IPaymentService paymentService;

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest paymentRequest, HttpServletRequest request){
        try{
            String paymentUrl = paymentService.createPaymentUrl(paymentRequest, request);
            return ResponseEntity.ok().body(paymentUrl);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/success")
    public void successPayment(@RequestBody PaymentSuccessRequest request){
        paymentService.paymentSuccessfully(request);
    }
}

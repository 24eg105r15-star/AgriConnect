package app.controller;

import app.dto.TransactionResponse;
import app.service.TransactionService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions/orders")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/{orderId}")
    public TransactionResponse createTransaction(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails user) {
        return transactionService.createTransaction(
                orderId, user.getUsername());
    }

    @GetMapping("/{orderId}")
    public TransactionResponse getTransaction(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails user) {
        return transactionService.getTransactionByOrder(
                orderId, user.getUsername());
    }
}
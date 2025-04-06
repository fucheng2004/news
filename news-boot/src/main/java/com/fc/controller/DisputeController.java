package com.fc.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping()
public class DisputeController {

    @PostMapping("/dispute")
    public ResponseEntity<String> submitDispute(
            @RequestParam("newsId") String newsId,
            @RequestParam("reason") String reason,
            @RequestParam("contact") String contact,
            @RequestParam(value = "evidence_0", required = false) MultipartFile evidence0,
            @RequestParam(value = "evidence_1", required = false) MultipartFile evidence1) {

        try {
            // Process each file (if provided)
            if (evidence0 != null) {
                // Save or process evidence0 file
            }
            if (evidence1 != null) {
                // Save or process evidence1 file
            }

            return ResponseEntity.ok("Dispute submitted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to submit dispute.");
        }
    }

}

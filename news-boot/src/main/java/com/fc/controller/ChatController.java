package com.fc.controller;


import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

@RequestMapping("")
@RestController
public class ChatController {
    private final WebClient.Builder webClientBuilder1;

    public ChatController(WebClient.Builder webClientBuilder1) {
        this.webClientBuilder1 = webClientBuilder1;
    }

    @RequestMapping("/chat")
    public String chat(@RequestBody String message) {
        WebClient webClient = webClientBuilder1.build();
        return webClient.post()
                .uri("http://localhost:8000/chat")
                .header("Content-Type", "application/json")
                .bodyValue(message)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}

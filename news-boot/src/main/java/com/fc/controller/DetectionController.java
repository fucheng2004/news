package com.fc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import com.fc.pojo.TextDetectionRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("")
@Tag(name = "检测管理", description = "新闻真实性检测相关接口")
public class DetectionController {
    @Autowired
    private WebClient.Builder webClientBuilder;
    @PostMapping("/text")
    public Mono<String> textDetection(@RequestBody TextDetectionRequest TextDetectionRequest) {
        String fastApiUrl = "http://localhost:8000/text"; // FastAPI端点

        return webClientBuilder.baseUrl(fastApiUrl)
                .build()
                .post()
                .bodyValue(TextDetectionRequest)// 发送封装后的对象
                .retrieve()
                .bodyToMono(String.class);
    }
    @PostMapping("/image")
    public Mono<String> imageDetection(@RequestPart("file") MultipartFile file) {
        String fastApiUrl = "http://localhost:8000/image"; // FastAPI端点

        return webClientBuilder.baseUrl(fastApiUrl)
                .build()
                .post()
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", file.getResource()))  // 只传递文件本身
                .retrieve()
                .bodyToMono(String.class);
    }
    @PostMapping("/video")
    public Mono<String> videoDetection(@RequestPart("file") MultipartFile file) {
        String fastApiUrl = "http://localhost:8000/video"; // FastAPI端点

        // 将文件的字节数组传递给 WebClient，而不是整个 MultipartFile 对象
        return webClientBuilder.baseUrl(fastApiUrl)
                .build()
                .post()
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", file.getResource()))  // 只传递文件本身
                .retrieve()
                .bodyToMono(String.class);
    }
} 
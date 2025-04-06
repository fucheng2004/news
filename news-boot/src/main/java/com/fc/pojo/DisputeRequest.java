package com.fc.pojo;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
@Data
public class DisputeRequest {
    private String newsId;
    private String reason;
    private String contact;
    private MultipartFile evidence;
}


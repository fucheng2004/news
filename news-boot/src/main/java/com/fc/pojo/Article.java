package com.fc.pojo;

import lombok.Data;

@Data
public class Article {
    private Long id;
    private String title;
    private String content;
    private String category;
    private String createdAt;
    private String updatedAt;
    private String mediaType;
    private String sourceUrl;
} 
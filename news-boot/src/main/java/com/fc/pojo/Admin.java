package com.fc.pojo;

import lombok.Data;

@Data
public class Admin {
    private Long id;
    private String username;
    private String password;
    private String avatar;
    private String type;
    private String createdAt;
    private String updatedAt;
} 
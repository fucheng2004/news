package com.fc.pojo;

import lombok.Data;

@Data
public class Response {
    private String status;
    private String message;
    private Object data;

    // 构造函数
    public Response(String status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

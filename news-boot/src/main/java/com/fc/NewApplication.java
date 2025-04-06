package com.fc;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.fc.mapper")
public class NewApplication {
    public static void main(String[] args) {
        SpringApplication.run(NewApplication.class, args);
    }
}

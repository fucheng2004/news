package com.fc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("新闻真实性检测系统API")
                        .description("基于人工智能的新闻真实性检测平台")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("FC Team")
                                .email("support@example.com")));
    }
}

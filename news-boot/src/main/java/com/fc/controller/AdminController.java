package com.fc.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fc.pojo.Admin;
import com.fc.pojo.AdminL;
import com.fc.pojo.Result;
import com.fc.service.AdminService;
import com.fc.utils.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/admin")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://127.0.0.1:5173"},
    allowCredentials = "true",
    allowedHeaders = "*",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
    }
)
@Tag(name = "管理员管理", description = "管理员相关接口")
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    @Operation(summary = "管理员登录")
    public Result<Map<String, Object>> login(@RequestBody AdminL adminL) {
        log.info("=== 开始处理管理员登录请求 ===");
        log.info("登录数据: {}", adminL);
        
        try {
            // 参数校验
            if (adminL == null || adminL.getUsername() == null || adminL.getPassword() == null) {
                return Result.error("用户名和密码不能为空");
            }
            
            Admin admin = adminService.login(adminL.getUsername(), adminL.getPassword(), adminL.getType());
            
            if (admin == null) {
                return Result.error("用户名或密码错误");
            }
            
            // 生成JWT令牌
            Map<String, Object> claims = new HashMap<>();
            claims.put("adminId", admin.getId());
            claims.put("username", admin.getUsername());
            claims.put("type", admin.getType());
            
            String token = jwtUtil.generateToken(claims);
            
            // 构建返回数据
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("user", admin);
            
            log.info("管理员登录成功: {}", admin.getUsername());
            return Result.success(result);
        } catch (Exception e) {
            log.error("管理员登录失败", e);
            return Result.error("登录失败：" + e.getMessage());
        }
    }
} 
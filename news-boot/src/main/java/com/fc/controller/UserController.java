package com.fc.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.fc.pojo.UserL;
import com.fc.pojo.UserR;
import com.fc.utils.Md5Util;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import com.fc.pojo.Result;
import com.fc.pojo.User;
import com.fc.service.UserService;
import com.fc.utils.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Slf4j
@RestController
@RequestMapping("/user")
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
@Tag(name = "用户管理", description = "用户相关接口")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public Result<Map<String, Object>> register(@RequestBody UserR user) {
        log.info("=== 开始处理注册请求 ===");
        log.info("注册数据: {}", user);
        try {
            // 参数校验
            if (user == null || user.getUsername() == null || user.getPassword() == null) {
                return Result.error("用户名和密码不能为空");
            }
            // 检查用户是否存在
            User existingUser = userService.findByUserName(user.getUsername());
            if (existingUser != null) {
                return Result.error("用户已存在");
            }
            // 注册用户
           userService.register(user);

        return Result.success();
        } catch (Exception e) {
            log.error("注册失败", e);
            return Result.error("注册失败：" + e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public Result<Map<String, Object>> login(@RequestBody UserL user) {
        User loginUser = userService.findByUserName(user.getUsername());
        if(loginUser == null){
            return Result.error("用户不存在");
        }
        if (loginUser.getPassword().equals(Md5Util.getMD5String(user.getPassword()))) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", loginUser.getId());
            claims.put("username", loginUser.getUsername());
            
            String token = jwtUtil.generateToken(claims);
            
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("user", loginUser);
            
            return Result.success(result);
        }
        return Result.error("用户名或密码错误");
    }
    
    @PutMapping
    @Operation(summary = "更新用户信息")
    public Result<Void> update(@RequestBody User user) {
        userService.update(user);
        return Result.success();
    }
}

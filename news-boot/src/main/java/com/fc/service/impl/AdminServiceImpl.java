package com.fc.service.impl;

import com.fc.mapper.AdminMapper;
import com.fc.pojo.Admin;
import com.fc.service.AdminService;
import com.fc.utils.Md5Util;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public Admin login(String username, String password, String type) {
        log.info("管理员登录: username={}, type={}", username, type);
        
        Admin admin = adminMapper.findByUsername(username);
        if (admin == null) {
            log.warn("管理员不存在: {}", username);
            return null;
        }
        
        // 验证密码
        if (!admin.getPassword().equals(Md5Util.getMD5String(password))) {
            log.warn("密码错误: {}", username);
            return null;
        }
        
        // 验证类型
        if (!admin.getType().equals(type)) {
            log.warn("管理员类型不匹配: {} != {}", admin.getType(), type);
            return null;
        }
        
        admin.setPassword(null); // 不返回密码
        return admin;
    }

    @Override
    public Admin findByUserName(String username) {
        return adminMapper.findByUsername(username);
    }
} 
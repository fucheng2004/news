package com.fc.service;

import com.fc.pojo.Admin;

public interface AdminService {
    /**
     * 管理员登录
     */
    Admin login(String username, String password, String type);
    
    /**
     * 根据用户名查找管理员
     */
    Admin findByUserName(String username);
}
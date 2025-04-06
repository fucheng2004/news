package com.fc.service;

import com.fc.pojo.User;
import com.fc.pojo.UserR;

public interface UserService {
    /**
     * 用户注册
     */
    void register(UserR userR);
    
    /**
     * 根据用户名查找用户
     */
    User findByUserName(String username);
    
    /**
     * 更新用户信息
     */
    void update(User user);
}

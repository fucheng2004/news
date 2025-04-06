package com.fc.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.fc.pojo.UserR;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fc.mapper.UserMapper;
import com.fc.pojo.User;
import com.fc.service.UserService;
import com.fc.utils.Md5Util;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(formatter) : null;
    }
    
    @Override
    public User findByUserName(String username) {
        return userMapper.findByUsername(username);
    }

    @Override
    @Transactional
    public void register(UserR userR) {
            User user = new User();
            user.setUsername(userR.getUsername());
            user.setPassword(Md5Util.getMD5String(userR.getPassword()));
            user.setEmail(userR.getEmail());
            user.setAvatar("");
            user.setCreatedAt(formatDateTime(LocalDateTime.now()));
            user.setUpdatedAt(formatDateTime(LocalDateTime.now()));
            userMapper.insert(user);
    }
    
    @Override
    public void update(User user) {
        user.setUpdatedAt(formatDateTime(LocalDateTime.now()));
        userMapper.update(user);
    }
}

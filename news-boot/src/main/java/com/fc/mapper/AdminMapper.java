package com.fc.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.fc.pojo.Admin;

@Mapper
public interface AdminMapper {
    /**
     * 根据用户名查找管理员
     */
    @Select("SELECT * FROM admin WHERE username = #{username}")
    Admin findByUsername(@Param("username") String username);
} 
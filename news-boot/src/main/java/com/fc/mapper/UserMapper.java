package com.fc.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.fc.pojo.User;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(String username);

    @Update("UPDATE user SET " +
            "username = #{username}, " +
            "email = #{email}, " +
            "avatar = #{avatar}, " +
            "updated_at = #{updatedAt} " +
            "WHERE id = #{id}")
    void update(User user);

    @Insert("insert into user(username,password,email,created_at,updated_at,avatar)"+
            " values(#{username},#{password},#{email},now(),now(),#{avatar})")
    void insert(User user);

    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Long id);
}

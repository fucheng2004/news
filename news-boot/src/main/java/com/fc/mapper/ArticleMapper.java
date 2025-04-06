package com.fc.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ArticleMapper {
    com.fc.pojo.Article findById(Long id);
} 
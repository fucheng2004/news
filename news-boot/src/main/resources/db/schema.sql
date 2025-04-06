-- 创建数据库
CREATE DATABASE IF NOT EXISTS news_detection DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE news_detection;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `nickname` VARCHAR(50),
    `email` VARCHAR(50),
    `avatar` VARCHAR(255),
    `created_at` VARCHAR(20),
    `updated_at` VARCHAR(20)
);

-- 检测结果表
CREATE TABLE IF NOT EXISTS detection_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    credibility DOUBLE,
    source VARCHAR(100),
    summary TEXT,
    category VARCHAR(50),
    status VARCHAR(20),
    verified_at VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 检测详情表
CREATE TABLE IF NOT EXISTS detection_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    result_id BIGINT,
    type VARCHAR(50),
    score DOUBLE,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (result_id) REFERENCES detection_results(id)
);

-- 管理员表
CREATE TABLE IF NOT EXISTS `admin` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `avatar` VARCHAR(255),
    `type` VARCHAR(20) NOT NULL,
    `created_at` VARCHAR(20),
    `updated_at` VARCHAR(20)
); 
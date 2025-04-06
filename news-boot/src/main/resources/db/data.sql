USE news_detection;

-- 添加初始管理员账户 (用户名: admin, 密码: 123456)
INSERT INTO `admin` (`username`, `password`, `type`, `created_at`, `updated_at`)
VALUES ('admin', 'e10adc3949ba59abbe56e057f20f883e', 'super', NOW(), NOW()); 
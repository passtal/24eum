package com.aloha._24eum.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages = "com.aloha._24eum.dao")
public class MyBatisConfig {
}

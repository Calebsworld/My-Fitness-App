package com.calebcodes.fitness.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.root.user}")
    private String minioRootUser;

    @Value("${minio.root.password}")
    private String minioRootPassword;


    @Value("${minio.bucket.name}")
    private String defaultBucketName;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(minioRootUser, minioRootPassword)
                .build();
    }



}

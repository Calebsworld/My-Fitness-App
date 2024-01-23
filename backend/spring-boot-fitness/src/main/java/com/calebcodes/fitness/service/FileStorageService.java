package com.calebcodes.fitness.service;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.MinioException;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
public class FileStorageService {

    @Value("${minio.bucket.name}")
    private String bucketName;

    @Autowired
    private MinioClient minioClient;

    public FileStorageService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public void uploadFile(MultipartFile file, String sanitizedFileName) {
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(sanitizedFileName)
                            .stream(
                                    file.getInputStream(),
                                    file.getSize(),
                                    -1
                            )
                            .contentType(file.getContentType())
                            .build()
            );
        } catch (MinioException e) {
            throw new RuntimeException("Error uploading file: " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException("Error uploading file: " + e.getMessage());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error uploading file: " + e.getMessage());
        } catch (InvalidKeyException e) {
            throw new RuntimeException("Error uploading file: " + e.getMessage());
        }
    }

    public String fetchFile(String imageName) {

        byte[] imageData = null;

        if (imageName == null || imageName.isEmpty()) {
            return "";
        }

        try {
            InputStream object = minioClient.getObject(GetObjectArgs.builder()
                                                                    .bucket(bucketName)
                                                                    .object(imageName)
                                                                    .build());

            imageData = IOUtils.toByteArray(object);
        } catch (MinioException e) {
            throw new RuntimeException("Error fetching file: " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException("Error fetching file: " + e.getMessage());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error fetching file: " + e.getMessage());
        } catch (InvalidKeyException e) {
            throw new RuntimeException("Error fetching file: " + e.getMessage());
        }
        return Base64.getEncoder().encodeToString(imageData);
    }

}

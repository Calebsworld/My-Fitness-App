package com.calebcodes.fitness.utils;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
@Data
public class FileUploader {

    @Value("${file.uploadDir}")
    private String uploadDir;

    @Value("${file.baseDir}")
    private String baseDir;

    public void saveFile(MultipartFile file, String sanitizedFileName) throws IOException {
        try {
            // Resolve the file path
            Path filePath = Paths.get(this.uploadDir + sanitizedFileName);
            // Save the file to the disk
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IOException("Could not save file: " + sanitizedFileName, e);
        }
    }

    public String getFileUrl(String sanitizedFileName) {
        return this.baseDir + sanitizedFileName;
    }

}

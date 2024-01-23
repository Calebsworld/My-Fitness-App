package com.calebcodes.fitness.utils;

import com.calebcodes.fitness.exception.EmptyFileException;
import com.calebcodes.fitness.exception.FileTooLargeException;
import com.calebcodes.fitness.exception.InvalidFileNameException;
import com.calebcodes.fitness.exception.UnsupportedFileTypeException;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

public class FileValidationUtils {

    // Regular expression to match against a safe file name pattern
    // This regex allows only letters, numbers, underscores, hyphens, and periods

    private static final List<String> SUPPORTED_CONTENT_TYPES = List.of("image/png", "image/jpeg", "image/gif");
    private static final String SAFE_PATTERN = "^[a-zA-Z0-9_-]+[.]([a-zA-Z0-9]{1,4})$";

    private static final long MAX_SIZE = 5242880L;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public static void validateFileSizeAndType(MultipartFile file) {
        checkForEmptyFileOrThrow(file);
        validateFileSizeOrThrow(file.getSize());
        validateFileTypeOrThrow(file.getContentType());
    }

    public static void validateFileName(String fileName) {
        validateFileNameOrThrow(fileName);
        checkForHiddenFileOrThrow(fileName);
        checkForDirectoryTraversalOrThrow(fileName);
    }

    public static String sanitizeFileName(String fileName) {
        if (fileName == null || fileName.trim().isEmpty()) {
            return null;
        }

        // Find the file extension, if present.
        String extension = "";
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex != -1) {
            extension = fileName.substring(lastDotIndex); // Includes the dot
            fileName = fileName.substring(0, lastDotIndex); // Exclude extension for now
        }

        // Normalize the file name (excluding extension)
        String normalizedFileName = Normalizer.normalize(fileName, Normalizer.Form.NFD);

        // Replace whitespace with hyphens and remove non-Latin characters
        String noWhiteSpace = WHITESPACE.matcher(normalizedFileName).replaceAll("-");
        String cleanedFileName = NONLATIN.matcher(noWhiteSpace).replaceAll("");

        // Truncate the cleaned file name if it's too long
        int MAX_LENGTH = 255;
        if (cleanedFileName.length() + extension.length() > MAX_LENGTH) {
            cleanedFileName = cleanedFileName.substring(0, MAX_LENGTH - extension.length());
        }

        // Re-append the extension to the sanitized file name
        cleanedFileName += extension;

        return cleanedFileName;
    }

    public static void validateFileSizeOrThrow(long fileSize) {
        if (fileSize > MAX_SIZE) {
            throw new FileTooLargeException("File size is too large");
        }
    }

    public static void checkForEmptyFileOrThrow(MultipartFile file) {
        if (file.isEmpty()) {
            throw new EmptyFileException("File is empty");
        }
    }

    public static void validateFileTypeOrThrow(String contentType) {
        if (!SUPPORTED_CONTENT_TYPES.contains(contentType)) {
            System.out.println("Unsupported file type: " + contentType);
            throw new UnsupportedFileTypeException("File type is not supported");
        }
    }

    public static void validateFileNameOrThrow(String fileName) {
        if (!fileName.matches(SAFE_PATTERN)) {
            System.out.println("Invalid file name: " + fileName);
            throw new InvalidFileNameException("File name is not valid");
        }
    }

    public static void checkForDirectoryTraversalOrThrow(String fileName) {
        if (fileName.contains("..")) {
            throw new InvalidFileNameException("Invalid path sequence");
        }
    }

    public static void checkForHiddenFileOrThrow(String fileName) {
        if (fileName.startsWith(".")) {
            throw new InvalidFileNameException("Hidden files are not allowed");
        }
    }





}
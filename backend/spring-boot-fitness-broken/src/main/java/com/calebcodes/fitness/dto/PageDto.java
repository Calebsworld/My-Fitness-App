package com.calebcodes.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageDto {

    private int currentPage;
    private int pageSize;
    private int totalPages;
    private long totalElements;


}

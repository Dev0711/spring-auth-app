package com.devoza.authapp.dto;

import lombok.*;

@Data @AllArgsConstructor
public class ApiResponse {
    private boolean success;
    private String message;
}

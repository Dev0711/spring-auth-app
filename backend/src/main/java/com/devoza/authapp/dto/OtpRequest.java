package com.devoza.authapp.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OtpRequest {
    @NotBlank @Email
    private String email;
}

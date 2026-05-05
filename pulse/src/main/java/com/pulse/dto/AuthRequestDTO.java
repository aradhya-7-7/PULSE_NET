package com.pulse.dto;

import lombok.Data;

@Data
public class AuthRequestDTO {
    private String email;
    private String password;
}
package com.pulse.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostRequestDTO {
    // The ONLY thing we want the frontend to send us!
    private String content;
}
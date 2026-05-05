package com.pulse.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class PostResponseDTO {
    private UUID id;
    private UUID userId;
    private String userEmail;
    private String content;
    private LocalDateTime createdAt;
    private int likesCount;

    // We manually write the constructor here to bypass any IDE Lombok issues!
    public PostResponseDTO(UUID id, UUID userId, String userEmail, String content, LocalDateTime createdAt, int likesCount) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.content = content;
        this.createdAt = createdAt;
        this.likesCount = likesCount;
    }
}
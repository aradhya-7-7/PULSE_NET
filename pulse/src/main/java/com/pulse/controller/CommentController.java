package com.pulse.controller;

import com.pulse.model.Comment;
import com.pulse.model.Post;
import com.pulse.model.User;
import com.pulse.repository.CommentRepository;
import com.pulse.repository.PostRepository;
import com.pulse.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentController(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // A lightweight DTO to send comment data safely to React
    public record CommentDTO(UUID id, String userEmail, String content, LocalDateTime createdAt) {}

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable UUID postId) {
        List<CommentDTO> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
            .stream()
            .map(c -> new CommentDTO(
                c.getId(), 
                c.getUser().getEmail(), 
                c.getContent(), 
                LocalDateTime.ofInstant(c.getCreatedAt(), ZoneOffset.UTC) // UTC Safety Check!
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<CommentDTO> addComment(@PathVariable UUID postId, @RequestBody Map<String, String> payload, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(payload.get("content"));
        
        comment = commentRepository.save(comment);

        return ResponseEntity.ok(new CommentDTO(
            comment.getId(), 
            user.getEmail(), 
            comment.getContent(), 
            LocalDateTime.now(ZoneOffset.UTC)
        ));
    }
}
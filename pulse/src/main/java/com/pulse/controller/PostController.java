package com.pulse.controller;

import com.pulse.dto.PostRequestDTO;
import com.pulse.dto.PostResponseDTO;
import com.pulse.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    // Manual constructor for STS compatibility
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 1. Get Trending Feed
    @GetMapping("/trending")
    public ResponseEntity<Page<PostResponseDTO>> getTrendingPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(postService.getTrendingFeed(page, size));
    }
    
    // 2. Create a Post
    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody PostRequestDTO request, Principal principal) {
        // principal.getName() automatically contains the email extracted from the JWT token!
        PostResponseDTO newPost = postService.createPost(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(newPost);
    }

    // 3. Like / Unlike a Post
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable UUID id, Principal principal) {
        postService.toggleLike(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    // 4. Edit a Post
    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDTO> updatePost(
            @PathVariable UUID id, 
            @RequestBody PostRequestDTO request, 
            Principal principal) {
        
        PostResponseDTO updatedPost = postService.updatePost(id, request, principal.getName());
        return ResponseEntity.ok(updatedPost);
    }

    // 5. Delete a Post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable UUID id, Principal principal) {
        postService.deletePost(id, principal.getName());
        return ResponseEntity.noContent().build(); // Returns a 204 No Content success status
    }
}
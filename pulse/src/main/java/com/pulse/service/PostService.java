package com.pulse.service;

import com.pulse.dto.PostRequestDTO;
import com.pulse.dto.PostResponseDTO;
import com.pulse.model.Like;
import com.pulse.model.Post;
import com.pulse.model.User;
import com.pulse.repository.LikeRepository;
import com.pulse.repository.PostRepository;
import com.pulse.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public PostService(PostRepository postRepository, UserRepository userRepository, 
                       LikeRepository likeRepository, SimpMessagingTemplate messagingTemplate) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Page<PostResponseDTO> getTrendingFeed(int page, int size) {
        Page<Object[]> results = postRepository.findTrendingPostsWithScore(PageRequest.of(page, size));
        
        return results.map(row -> {
            // Shifted index: row[4] is now created_at because row[2] is email
            LocalDateTime createdAt = (row[4] instanceof Timestamp) 
                ? ((Timestamp) row[4]).toLocalDateTime() 
                : (LocalDateTime) row[4];

            return new PostResponseDTO(
                (UUID) row[0],                 // id
                (UUID) row[1],                 // user_id
                (String) row[2],               // userEmail
                (String) row[3],               // content
                createdAt,                     // created_at 
                ((Number) row[5]).intValue()   // likes_count 
            );
        });
    }

    public PostResponseDTO createPost(PostRequestDTO request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setContent(request.getContent());
        
        post = postRepository.save(post);

        return new PostResponseDTO(
                post.getId(), 
                user.getId(), 
                user.getEmail(), // Injected email
                post.getContent(), 
                // Convert Instant to UTC LocalDateTime safely
                post.getCreatedAt() != null ? LocalDateTime.ofInstant(post.getCreatedAt(), ZoneOffset.UTC) : LocalDateTime.now(ZoneOffset.UTC), 
                0
        );
    }

    public void toggleLike(UUID postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            likeRepository.save(like);
        }

        // Broadcast the updated like count immediately to all listeners
        int newLikeCount = (int) likeRepository.countByPostId(postId);
        messagingTemplate.convertAndSend("/topic/likes/" + postId, newLikeCount);
    }

    public PostResponseDTO updatePost(UUID postId, PostRequestDTO request, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized: You can only edit your own posts");
        }

        post.setContent(request.getContent());
        post = postRepository.save(post);

        int likesCount = likeRepository.findByUserAndPost(post.getUser(), post).isPresent() ? 1 : 0; 
        
        return new PostResponseDTO(
                post.getId(), 
                post.getUser().getId(), 
                post.getUser().getEmail(), // Injected email
                post.getContent(), 
                // Convert Instant to UTC LocalDateTime safely
                LocalDateTime.ofInstant(post.getCreatedAt(), ZoneOffset.UTC), 
                likesCount 
        );
    }

    public void deletePost(UUID postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized: You can only delete your own posts");
        }

        postRepository.delete(post);
    }
}
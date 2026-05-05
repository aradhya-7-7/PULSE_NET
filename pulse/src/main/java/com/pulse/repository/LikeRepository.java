package com.pulse.repository;

import com.pulse.model.Like;
import com.pulse.model.Post;
import com.pulse.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LikeRepository extends JpaRepository<Like, UUID> {
    
    // Checks if a user already liked a specific post
    Optional<Like> findByUserAndPost(User user, Post post);
    
    // NEW: Instantly counts total likes for a post (Used for WebSockets!)
    long countByPostId(UUID postId);
}
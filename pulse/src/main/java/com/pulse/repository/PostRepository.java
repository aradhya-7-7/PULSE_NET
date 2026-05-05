package com.pulse.repository;

import com.pulse.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    
    // NEW: Added u.email to the SELECT and GROUP BY clauses
    @Query(value = "SELECT p.id, p.user_id, u.email, p.content, p.created_at, " +
            "COUNT(l.id) as likes_count, " +
            "((COUNT(l.id) * 2.0) / (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600 + 1)) AS score " +
            "FROM posts p " +
            "JOIN users u ON p.user_id = u.id " +
            "LEFT JOIN likes l ON p.id = l.post_id " +
            "GROUP BY p.id, p.user_id, u.email, p.content, p.created_at " +
            "ORDER BY score DESC", 
            nativeQuery = true)
    Page<Object[]> findTrendingPostsWithScore(Pageable pageable);
}
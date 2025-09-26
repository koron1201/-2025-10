package com.example.demo.repository;

import com.example.demo.model.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends JpaRepository<Email, Long> {
    // JpaRepository によって基本 CRUD メソッドは自動生成されます
}

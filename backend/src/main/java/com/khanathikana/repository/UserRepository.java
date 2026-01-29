package com.khanathikana.repository;

import com.khanathikana.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByPasscode(String passcode);
    Optional<User> findByCardId(String cardId);
    boolean existsByUsername(String username);
}

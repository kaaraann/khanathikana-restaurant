package com.khanathikana.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true)
    private String passcode;
    
    @Column(name = "card_id", unique = true)
    private String cardId;
    
    @Column(nullable = false)
    private String role = "USER";
    
    @Column(nullable = false)
    private Boolean active = true;
}

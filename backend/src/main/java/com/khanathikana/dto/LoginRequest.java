package com.khanathikana.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
    private String passcode;
    private String cardId;
    private String loginType;
}

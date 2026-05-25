package com.goodvision.service;

import com.goodvision.dto.LoginRequest;
import com.goodvision.dto.LoginResponse;
import com.goodvision.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
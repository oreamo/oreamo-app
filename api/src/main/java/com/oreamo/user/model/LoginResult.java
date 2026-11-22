package com.oreamo.user.model;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class LoginResult {

    @Schema(description = "Whether the password should be changed before login")
    private final boolean passwordChangeRequired;

    public static LoginResult ofSessionUser(SessionUser sessionUser) {
        return new LoginResult(sessionUser.isPasswordChangeRequired());
    }
}

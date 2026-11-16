package com.oreamo.user.model;

import jakarta.validation.constraints.NotBlank;

import com.oreamo.common.constant.TranslationKey;
import com.oreamo.common.model.OperationAuthor;

import org.springframework.security.crypto.password.PasswordEncoder;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserPasswordReset extends OperationAuthor {

    @Schema(description = "Username")
    @NotBlank(message = TranslationKey.User.Label.USERNAME)
    private String username;

    public static UserPasswordReset ofSessionUser(SessionUser sessionUser) {
        UserPasswordReset userPasswordReset = new UserPasswordReset();
        userPasswordReset.setUsername(sessionUser.getUsername());
        userPasswordReset.setAuthor(sessionUser.getUsername());
        return userPasswordReset;
    }

    public UserUpdate toUserUpdate(PasswordEncoder passwordEncoder, String initialPassword) {
        UserUpdate userUpdate = new UserUpdate();
        userUpdate.setUsername(username);
        userUpdate.setPassword(passwordEncoder.encode(initialPassword));
        userUpdate.setAuthor(getAuthor());
        return userUpdate;
    }
}

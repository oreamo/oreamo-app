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

    public UserPasswordUpdate toUserPasswordUpdate(PasswordEncoder passwordEncoder, String initialPassword) {
        UserPasswordUpdate userPasswordUpdate = new UserPasswordUpdate();
        userPasswordUpdate.setUsername(username);
        userPasswordUpdate.setPassword(passwordEncoder.encode(initialPassword));
        userPasswordUpdate.setPasswordChanged(false);
        userPasswordUpdate.setAuthor(getAuthor());
        return userPasswordUpdate;
    }
}

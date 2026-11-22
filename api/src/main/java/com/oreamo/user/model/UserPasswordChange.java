package com.oreamo.user.model;

import java.util.regex.Pattern;

import jakarta.validation.constraints.NotBlank;

import com.oreamo.common.constant.TranslationKey;

import org.springframework.security.crypto.password.PasswordEncoder;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserPasswordChange {

    private static final Pattern PASSWORD_RULE_PATTERN =
            Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d\\s])\\S{8,}$");

    @Schema(description = "Username")
    @NotBlank(message = TranslationKey.User.Label.USERNAME)
    private String username;

    @Schema(description = "Current Password")
    @NotBlank(message = TranslationKey.User.Label.CURRENT_PASSWORD)
    private String currentPassword;

    @Schema(description = "New Password")
    @NotBlank(message = TranslationKey.User.Label.NEW_PASSWORD)
    private String newPassword;

    public boolean isNewPasswordReused() {
        return newPassword.equals(currentPassword);
    }

    public boolean isNewPasswordRuleValid() {
        return PASSWORD_RULE_PATTERN.matcher(newPassword).matches();
    }

    public UserPasswordUpdate toUserPasswordUpdate(PasswordEncoder passwordEncoder) {
        UserPasswordUpdate userPasswordUpdate = new UserPasswordUpdate();
        userPasswordUpdate.setUsername(username);
        userPasswordUpdate.setPassword(passwordEncoder.encode(newPassword));
        userPasswordUpdate.setPasswordChanged(true);
        userPasswordUpdate.setAuthor(username);
        return userPasswordUpdate;
    }
}

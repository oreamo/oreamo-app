package com.oreamo.user.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.oreamo.common.constant.TranslationKey;
import com.oreamo.common.model.OperationAuthor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserSave extends OperationAuthor {

    @Schema(description = "Username")
    @NotBlank(message = TranslationKey.User.Label.USERNAME)
    @Size(min = 6, max = 50, message = TranslationKey.User.Label.USERNAME)
    private String username;

    @Schema(description = "Name", example = "Admin")
    @NotBlank(message = TranslationKey.User.Label.NAME)
    @Size(max = 100, message = TranslationKey.User.Label.NAME)
    private String name;

    @Schema(description = "Email", example = "user@example.com")
    @NotBlank(message = TranslationKey.User.Label.EMAIL)
    @Email(message = TranslationKey.User.Label.EMAIL)
    @Size(max = 100, message = TranslationKey.User.Label.EMAIL)
    private String email;

    @Schema(description = "Password (initial password is used when empty)")
    private String password;

    @Schema(description = "Role Code", example = "ROLE_USER")
    @NotBlank(message = TranslationKey.Authority.Label.ROLE)
    private String roleCode;

    @Schema(description = "Data Status", example = "ENABLED")
    @NotBlank(message = TranslationKey.Common.Label.DATA_STATUS)
    private String dataStatus;

    public void encodePassword(PasswordEncoder passwordEncoder, String initialPassword) {
        String rawPassword = StringUtils.hasText(password) ? password : initialPassword;
        this.password = passwordEncoder.encode(rawPassword);
    }
}

package com.oreamo.user.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oreamo.common.model.DataRecord;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class User extends DataRecord {

    @Schema(description = "Username", example = "oreamo-admin")
    private String username;

    @Schema(description = "Name", example = "Admin")
    private String name;

    @Schema(description = "Email", example = "user@example.com")
    private String email;

    @JsonIgnore
    @Schema(hidden = true)
    private String password;

    @JsonIgnore
    @Schema(hidden = true)
    private LocalDateTime passwordChangedAt;

    @Schema(description = "Role Code", example = "ROLE_ADMIN")
    private String roleCode;

    @Schema(description = "Profile Image File Group ID")
    private String profileImageFileGroupId;

    public boolean hasProfileImage() {
        return StringUtils.hasText(profileImageFileGroupId);
    }

    @JsonIgnore
    public boolean isPasswordChangeRequired() {
        return passwordChangedAt == null;
    }

    public boolean matchesPassword(PasswordEncoder passwordEncoder, String rawPassword) {
        return passwordEncoder.matches(rawPassword, password);
    }
}

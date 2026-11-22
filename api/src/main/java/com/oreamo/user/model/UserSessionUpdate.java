package com.oreamo.user.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oreamo.common.constant.TranslationKey;
import com.oreamo.common.model.OperationAuthor;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserSessionUpdate extends OperationAuthor {

    @Schema(description = "Name", example = "Admin")
    @NotBlank(message = TranslationKey.User.Label.NAME)
    @Size(max = 100, message = TranslationKey.User.Label.NAME)
    private String name;

    @Schema(description = "Email", example = "user@example.com")
    @NotBlank(message = TranslationKey.User.Label.EMAIL)
    @Email(message = TranslationKey.User.Label.EMAIL)
    @Size(max = 100, message = TranslationKey.User.Label.EMAIL)
    private String email;

    @JsonIgnore
    @Schema(hidden = true)
    public String getUsername() {
        return getAuthor();
    }

    public UserUpdate toUserUpdate() {
        UserUpdate userUpdate = new UserUpdate();
        userUpdate.setUsername(getUsername());
        userUpdate.setName(name);
        userUpdate.setEmail(email);
        userUpdate.setAuthor(getAuthor());
        return userUpdate;
    }
}

package com.oreamo.user.model;

import jakarta.validation.constraints.NotBlank;

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
public class UserSessionPasswordChange extends OperationAuthor {

    @Schema(description = "Current Password")
    @NotBlank(message = TranslationKey.User.Label.CURRENT_PASSWORD)
    private String currentPassword;

    @Schema(description = "New Password")
    @NotBlank(message = TranslationKey.User.Label.NEW_PASSWORD)
    private String newPassword;

    @JsonIgnore
    @Schema(hidden = true)
    public String getUsername() {
        return getAuthor();
    }

    public UserPasswordChange toUserPasswordChange() {
        UserPasswordChange userPasswordChange = new UserPasswordChange();
        userPasswordChange.setUsername(getUsername());
        userPasswordChange.setCurrentPassword(currentPassword);
        userPasswordChange.setNewPassword(newPassword);
        return userPasswordChange;
    }
}

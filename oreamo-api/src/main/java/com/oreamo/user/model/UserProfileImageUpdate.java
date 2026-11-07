package com.oreamo.user.model;

import jakarta.validation.constraints.NotBlank;

import com.oreamo.common.constant.TranslationKey;
import com.oreamo.common.model.OperationAuthor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserProfileImageUpdate extends OperationAuthor {

    @Schema(description = "Profile Image File Group ID")
    @NotBlank(message = TranslationKey.User.Label.PROFILE_IMAGE)
    private String fileGroupId;

    @JsonIgnore
    @Schema(hidden = true)
    public String getUsername() {
        return getAuthor();
    }
}

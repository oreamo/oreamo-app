package com.oreamo.authority.model;

import jakarta.validation.constraints.NotBlank;

import com.oreamo.common.constant.TranslationKey;
import com.oreamo.common.model.OperationAuthor;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoleDelete extends OperationAuthor {

    @Schema(description = "Role Code")
    @NotBlank(message = TranslationKey.Authority.Label.ROLE_CODE)
    private String roleCode;
}

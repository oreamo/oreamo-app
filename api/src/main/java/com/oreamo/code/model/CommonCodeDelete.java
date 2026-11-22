package com.oreamo.code.model;

import jakarta.validation.constraints.NotBlank;

import com.oreamo.common.constant.TranslationKey;
import com.oreamo.common.model.OperationAuthor;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommonCodeDelete extends OperationAuthor {

    @Schema(description = "Group Code")
    @NotBlank(message = TranslationKey.Code.Label.GROUP_CODE)
    private String groupCode;

    @Schema(description = "Common Code")
    @NotBlank(message = TranslationKey.Code.Label.COMMON_CODE)
    private String commonCode;
}

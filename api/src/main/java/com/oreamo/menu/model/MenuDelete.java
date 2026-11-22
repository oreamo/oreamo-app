package com.oreamo.menu.model;

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
public class MenuDelete extends OperationAuthor {

    @Schema(description = "Menu ID")
    @NotBlank(message = TranslationKey.Menu.Label.MENU_ID)
    private String menuId;
}

package com.oreamo.menu.model;

import com.oreamo.common.enums.ValueEnum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MenuId implements ValueEnum {
    CODE_MANAGEMENT("CODE_MANAGEMENT"),
    MENU_MANAGEMENT("MENU_MANAGEMENT"),
    USER_MANAGEMENT("USER_MANAGEMENT"),
    AUTHORITY_MANAGEMENT("AUTHORITY_MANAGEMENT"),
    TRANSLATION_MANAGEMENT("TRANSLATION_MANAGEMENT");

    private final String value;
}

package com.oreamo.authority.model;

import com.oreamo.common.enums.ValueEnum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PermissionCode implements ValueEnum {
    READ("READ"),
    WRITE("WRITE");

    private final String value;
}

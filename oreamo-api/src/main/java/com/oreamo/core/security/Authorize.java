package com.oreamo.core.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.oreamo.authority.model.PermissionCode;
import com.oreamo.menu.model.MenuId;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Authorize {

    MenuId menuId();

    PermissionCode permissionCode();
}

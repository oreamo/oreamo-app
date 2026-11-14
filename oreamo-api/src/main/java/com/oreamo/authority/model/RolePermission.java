package com.oreamo.authority.model;

import com.oreamo.menu.model.MenuId;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RolePermission {

    @Schema(description = "Menu ID", example = "CODE_MANAGEMENT")
    private String menuId;

    @Schema(description = "Permission Code", example = "READ")
    private String permissionCode;

    public boolean isGranted(MenuId menuId, PermissionCode permissionCode) {
        return menuId.getValue().equals(this.menuId) && permissionCode.getValue().equals(this.permissionCode);
    }

    public boolean isReadable() {
        return PermissionCode.READ.getValue().equals(permissionCode);
    }
}

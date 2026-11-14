package com.oreamo.user.model;

import java.util.List;

import com.oreamo.authority.model.RolePermission;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "user Information")
public class SessionUserInfo {

    @Schema(description = "Username", example = "oreamo-admin")
    private String username;

    @Schema(description = "Role Code", example = "ROLE_ADMIN")
    private String roleCode;

    @Schema(description = "Role Permissions")
    private List<RolePermission> rolePermissions;

    @Schema(description = "Profile Image File Group ID")
    private String profileImageFileGroupId;

    @Schema(description = "Profile Image File ID")
    private String profileImageFileId;
}

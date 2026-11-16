package com.oreamo.authority.model;

import java.util.List;

import com.oreamo.common.model.DataRecord;

import org.springframework.util.CollectionUtils;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Role extends DataRecord {

    @Schema(description = "Role Code")
    private String roleCode;

    @Schema(description = "Role Name")
    private String roleName;

    @Schema(description = "Sort Order")
    private Integer sortOrder;

    @Schema(description = "Role Permissions")
    private List<RolePermission> rolePermissions;

    public boolean hasRolePermissions() {
        return !CollectionUtils.isEmpty(rolePermissions);
    }

    public RoleInfo toRoleInfo() {
        return RoleInfo.builder().roleCode(roleCode).roleName(roleName).build();
    }
}

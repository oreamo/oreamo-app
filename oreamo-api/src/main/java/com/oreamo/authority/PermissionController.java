package com.oreamo.authority;

import java.util.List;

import jakarta.validation.Valid;

import com.github.pagehelper.Page;
import com.oreamo.authority.model.Permission;
import com.oreamo.authority.model.PermissionCode;
import com.oreamo.authority.model.PermissionDelete;
import com.oreamo.authority.model.PermissionInfo;
import com.oreamo.authority.model.PermissionOperation;
import com.oreamo.authority.model.PermissionSave;
import com.oreamo.authority.model.PermissionSearch;
import com.oreamo.authority.model.PermissionUpdate;
import com.oreamo.authority.model.PermissionsSearch;
import com.oreamo.common.dto.PageResponse;
import com.oreamo.common.dto.RestResponse;
import com.oreamo.core.security.Authorize;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@Tag(name = "Permission", description = "Permission API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    @Operation(summary = "Get Permissions")
    @GetMapping
    @Authorize(permissionCodes = PermissionCode.AUTHORITY_MANAGEMENT_READ)
    public RestResponse<PageResponse<Permission>> getPermissions(@ModelAttribute PermissionsSearch permissionsSearch) {
        Page<Permission> permissions = permissionService.getPermissions(permissionsSearch);
        return RestResponse.ofSuccess(PageResponse.ofPage(permissions));
    }

    @Operation(summary = "Get Permission Infos")
    @GetMapping("/infos")
    public RestResponse<List<PermissionInfo>> getPermissionInfos() {
        Page<Permission> permissions = permissionService.getPermissions(PermissionsSearch.ofEnabled());
        List<PermissionInfo> permissionInfos =
                permissions.stream().map(Permission::toPermissionInfo).toList();
        return RestResponse.ofSuccess(permissionInfos);
    }

    @Operation(summary = "Get Permission")
    @GetMapping("/{permissionCode}")
    @Authorize(permissionCodes = PermissionCode.AUTHORITY_MANAGEMENT_READ)
    public RestResponse<Permission> getPermission(@ModelAttribute PermissionSearch permissionSearch) {
        Permission foundPermission = permissionService.getPermission(permissionSearch);
        return RestResponse.ofSuccess(foundPermission);
    }

    @Operation(summary = "Post Permission")
    @PostMapping
    @Authorize(permissionCodes = PermissionCode.AUTHORITY_MANAGEMENT_WRITE)
    public RestResponse<Permission> postPermission(@Valid @RequestBody PermissionSave permissionSave) {
        Permission createdPermission = permissionService.savePermission(permissionSave);
        return RestResponse.ofSuccess(createdPermission);
    }

    @Operation(summary = "Put Permission")
    @PutMapping("/{permissionCode}")
    @Authorize(permissionCodes = PermissionCode.AUTHORITY_MANAGEMENT_WRITE)
    public RestResponse<Void> putPermission(@Valid @RequestBody PermissionUpdate permissionUpdate) {
        permissionService.updatePermission(permissionUpdate);
        return RestResponse.ofSuccess(null);
    }

    @Operation(summary = "Delete Permission")
    @DeleteMapping("/{permissionCode}")
    @Authorize(permissionCodes = PermissionCode.AUTHORITY_MANAGEMENT_WRITE)
    public RestResponse<Boolean> deletePermission(@Valid @RequestBody PermissionDelete permissionDelete) {
        permissionService.deletePermission(permissionDelete);
        return RestResponse.ofSuccess(true);
    }

    @Operation(summary = "Operate Permissions")
    @PostMapping("/operation")
    @Authorize(permissionCodes = PermissionCode.AUTHORITY_MANAGEMENT_WRITE)
    public RestResponse<Boolean> operationPermissions(@Valid @RequestBody PermissionOperation permissionOperation) {
        permissionService.operatePermissions(permissionOperation);
        return RestResponse.ofSuccess(true);
    }
}

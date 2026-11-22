package com.oreamo.authority;

import java.util.List;
import java.util.Optional;

import com.github.pagehelper.Page;
import com.oreamo.authority.model.Permission;
import com.oreamo.authority.model.PermissionDelete;
import com.oreamo.authority.model.PermissionSave;
import com.oreamo.authority.model.PermissionSearch;
import com.oreamo.authority.model.PermissionUpdate;
import com.oreamo.authority.model.PermissionsSearch;
import com.oreamo.authority.model.RolePermission;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PermissionRepository {

    Page<Permission> selectPermissions(PermissionsSearch permissionsSearch);

    List<RolePermission> selectRolePermissions(PermissionsSearch permissionsSearch);

    Optional<Permission> selectPermission(PermissionSearch permissionSearch);

    int insertPermission(PermissionSave permissionSave);

    int updatePermission(PermissionUpdate permissionUpdate);

    int deletePermission(PermissionDelete permissionDelete);

    int deleteRolePermissionsByPermissionDelete(PermissionDelete permissionDelete);
}

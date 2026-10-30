package com.oreamo.authority;

import java.util.Optional;

import com.oreamo.authority.model.Role;
import com.oreamo.authority.model.RoleDelete;
import com.oreamo.authority.model.RoleSave;
import com.oreamo.authority.model.RoleSearch;
import com.oreamo.authority.model.RoleUpdate;
import com.oreamo.authority.model.RolesSearch;
import com.github.pagehelper.Page;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoleRepository {

    Page<Role> selectRoles(RolesSearch rolesSearch);

    Optional<Role> selectRole(RoleSearch roleSearch);

    int insertRole(RoleSave roleSave);

    int insertRolePermissionsByRoleSave(RoleSave roleSave);

    int updateRole(RoleUpdate roleUpdate);

    int deleteRolePermissionsByRoleUpdate(RoleUpdate roleUpdate);

    int insertRolePermissionsByRoleUpdate(RoleUpdate roleUpdate);

    int deleteRole(RoleDelete roleDelete);

    int deleteRolePermissionsByRoleDelete(RoleDelete roleDelete);
}

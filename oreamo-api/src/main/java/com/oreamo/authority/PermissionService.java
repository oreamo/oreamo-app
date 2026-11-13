package com.oreamo.authority;

import com.github.pagehelper.Page;
import com.oreamo.authority.model.Permission;
import com.oreamo.authority.model.PermissionDelete;
import com.oreamo.authority.model.PermissionOperation;
import com.oreamo.authority.model.PermissionSave;
import com.oreamo.authority.model.PermissionSearch;
import com.oreamo.authority.model.PermissionUpdate;
import com.oreamo.authority.model.PermissionsSearch;
import com.oreamo.common.constant.TranslationKey;
import com.oreamo.common.exception.RestException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    @Transactional(readOnly = true)
    public Page<Permission> getPermissions(PermissionsSearch permissionsSearch) {
        permissionsSearch.validatePageable();
        return permissionRepository.selectPermissions(permissionsSearch);
    }

    @Transactional(readOnly = true)
    public Permission getPermission(PermissionSearch permissionSearch) {
        return permissionRepository
                .selectPermission(permissionSearch)
                .orElseThrow(() -> new RestException(
                        TranslationKey.Common.Message.NOT_FOUND_FAILURE, TranslationKey.Authority.Label.PERMISSION));
    }

    @Transactional
    public Permission savePermission(PermissionSave permissionSave) {
        PermissionSearch permissionSearch = PermissionSearch.ofPermissionCode(permissionSave.getPermissionCode());
        boolean permissionAlreadyExist =
                permissionRepository.selectPermission(permissionSearch).isPresent();
        if (permissionAlreadyExist) {
            throw new RestException(
                    TranslationKey.Common.Message.DUPLICATE_FAILURE,
                    TranslationKey.Authority.Label.PERMISSION_CODE,
                    permissionSave.getPermissionCode());
        }

        int createdCount = permissionRepository.insertPermission(permissionSave);
        if (createdCount == 0) {
            throw new RestException(TranslationKey.Common.Message.CREATE_FAILURE);
        }

        return permissionRepository
                .selectPermission(permissionSearch)
                .orElseThrow(() -> new RestException(TranslationKey.Common.Message.CREATE_FAILURE));
    }

    @Transactional
    public void updatePermission(PermissionUpdate permissionUpdate) {
        PermissionSearch permissionSearch = PermissionSearch.ofPermissionCode(permissionUpdate.getPermissionCode());
        getPermission(permissionSearch);

        int updatedCount = permissionRepository.updatePermission(permissionUpdate);
        if (updatedCount == 0) {
            throw new RestException(TranslationKey.Common.Message.UPDATE_FAILURE);
        }
    }

    @Transactional
    public void deletePermission(PermissionDelete permissionDelete) {
        PermissionSearch permissionSearch = PermissionSearch.ofPermissionCode(permissionDelete.getPermissionCode());
        getPermission(permissionSearch);

        permissionRepository.deleteRolePermissionsByPermissionDelete(permissionDelete);

        int deletedCount = permissionRepository.deletePermission(permissionDelete);
        if (deletedCount == 0) {
            throw new RestException(TranslationKey.Common.Message.DELETE_FAILURE);
        }
    }

    @Transactional
    public void operatePermissions(PermissionOperation permissionOperation) {
        if (permissionOperation.hasDeleteTargets()) {
            permissionOperation.getPermissionDeletes().forEach(this::deletePermission);
        }

        if (permissionOperation.hasUpdateTargets()) {
            permissionOperation.getPermissionUpdates().forEach(this::updatePermission);
        }

        if (permissionOperation.hasSaveTargets()) {
            permissionOperation.getPermissionSaves().forEach(this::savePermission);
        }
    }
}

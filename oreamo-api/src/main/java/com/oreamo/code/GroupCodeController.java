package com.oreamo.code;

import jakarta.validation.Valid;

import com.oreamo.authority.model.PermissionCode;
import com.oreamo.code.model.GroupCode;
import com.oreamo.code.model.GroupCodeDelete;
import com.oreamo.code.model.GroupCodeOperation;
import com.oreamo.code.model.GroupCodeSave;
import com.oreamo.code.model.GroupCodeSearch;
import com.oreamo.code.model.GroupCodeUpdate;
import com.oreamo.code.model.GroupCodesSearch;
import com.oreamo.common.dto.PageResponse;
import com.oreamo.common.dto.RestResponse;
import com.oreamo.core.security.Authorize;
import com.github.pagehelper.Page;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@Tag(name = "Group Code", description = "Group Code API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/group-codes")
public class GroupCodeController {

    private final GroupCodeService groupCodeService;

    @Operation(summary = "Get Group Codes")
    @GetMapping
    @Authorize(permissionCodes = PermissionCode.CODE_MANAGEMENT_READ)
    public RestResponse<PageResponse<GroupCode>> getGroupCodes(
            @Valid @ModelAttribute GroupCodesSearch groupCodesSearch) {
        Page<GroupCode> groupCodes = groupCodeService.getGroupCodes(groupCodesSearch);
        return RestResponse.ofSuccess(PageResponse.ofPage(groupCodes));
    }

    @Operation(summary = "Get Group Code")
    @GetMapping("/{groupCode}")
    @Authorize(permissionCodes = PermissionCode.CODE_MANAGEMENT_READ)
    public RestResponse<GroupCode> getGroupCode(@ModelAttribute GroupCodeSearch groupCodeSearch) {
        GroupCode foundGroupCode = groupCodeService.getGroupCode(groupCodeSearch);
        return RestResponse.ofSuccess(foundGroupCode);
    }

    @Operation(summary = "Post Group Code")
    @PostMapping
    @Authorize(permissionCodes = PermissionCode.CODE_MANAGEMENT_WRITE)
    public RestResponse<GroupCode> postGroupCode(@Valid @RequestBody GroupCodeSave groupCodeSave) {
        GroupCode createdGroupCode = groupCodeService.saveGroupCode(groupCodeSave);
        return RestResponse.ofSuccess(createdGroupCode);
    }

    @Operation(summary = "Put Group Code")
    @PutMapping("/{groupCode}")
    @Authorize(permissionCodes = PermissionCode.CODE_MANAGEMENT_WRITE)
    public RestResponse<GroupCode> putGroupCode(@Valid @RequestBody GroupCodeUpdate groupCodeUpdate) {
        GroupCode updatedGroupCode = groupCodeService.updateGroupCode(groupCodeUpdate);
        return RestResponse.ofSuccess(updatedGroupCode);
    }

    @Operation(summary = "Delete Group Code")
    @DeleteMapping("/{groupCode}")
    @Authorize(permissionCodes = PermissionCode.CODE_MANAGEMENT_WRITE)
    public RestResponse<Boolean> deleteGroupCode(@Valid @RequestBody GroupCodeDelete groupCodeDelete) {
        groupCodeService.deleteGroupCode(groupCodeDelete);
        return RestResponse.ofSuccess(true);
    }

    @Operation(summary = "Operate Group Codes")
    @PostMapping("/operation")
    @Authorize(permissionCodes = PermissionCode.CODE_MANAGEMENT_WRITE)
    public RestResponse<Boolean> operationGroupCodes(@Valid @RequestBody GroupCodeOperation groupCodeOperation) {
        groupCodeService.operateGroupCodes(groupCodeOperation);
        return RestResponse.ofSuccess(true);
    }
}

package com.oreamo.user;

import jakarta.validation.Valid;

import com.github.pagehelper.Page;
import com.oreamo.authority.model.PermissionCode;
import com.oreamo.common.dto.PageResponse;
import com.oreamo.common.dto.RestResponse;
import com.oreamo.core.security.Authorize;
import com.oreamo.menu.model.MenuId;
import com.oreamo.user.model.User;
import com.oreamo.user.model.UserDelete;
import com.oreamo.user.model.UserOperation;
import com.oreamo.user.model.UserPasswordReset;
import com.oreamo.user.model.UserSave;
import com.oreamo.user.model.UserSearch;
import com.oreamo.user.model.UserUpdate;
import com.oreamo.user.model.UsersSearch;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@Tag(name = "User", description = "User API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get Users")
    @GetMapping
    @Authorize(menuId = MenuId.USER_MANAGEMENT, permissionCode = PermissionCode.READ)
    public RestResponse<PageResponse<User>> getUsers(@Valid @ModelAttribute UsersSearch usersSearch) {
        Page<User> users = userService.getUsers(usersSearch);
        return RestResponse.ofSuccess(PageResponse.ofPage(users));
    }

    @Operation(summary = "Get User")
    @GetMapping("/{username}")
    @Authorize(menuId = MenuId.USER_MANAGEMENT, permissionCode = PermissionCode.READ)
    public RestResponse<User> getUser(@ModelAttribute UserSearch userSearch) {
        User foundUser = userService.getUser(userSearch);
        return RestResponse.ofSuccess(foundUser);
    }

    @Operation(summary = "Post User")
    @PostMapping
    @Authorize(menuId = MenuId.USER_MANAGEMENT, permissionCode = PermissionCode.WRITE)
    public RestResponse<User> postUser(@Valid @RequestBody UserSave userSave) {
        User createdUser = userService.saveUser(userSave);
        return RestResponse.ofSuccess(createdUser);
    }

    @Operation(summary = "Reset User Password")
    @PostMapping("/password/reset")
    @Authorize(menuId = MenuId.USER_MANAGEMENT, permissionCode = PermissionCode.WRITE)
    public RestResponse<Boolean> resetUserPassword(@Valid @RequestBody UserPasswordReset userPasswordReset) {
        userService.resetUserPassword(userPasswordReset);
        return RestResponse.ofSuccess(true);
    }

    @Operation(summary = "Put User")
    @PutMapping("/{username}")
    @Authorize(menuId = MenuId.USER_MANAGEMENT, permissionCode = PermissionCode.WRITE)
    public RestResponse<Void> putUser(@Valid @RequestBody UserUpdate userUpdate) {
        userService.updateUser(userUpdate);
        return RestResponse.ofSuccess(null);
    }

    @Operation(summary = "Delete User")
    @DeleteMapping("/{username}")
    @Authorize(menuId = MenuId.USER_MANAGEMENT, permissionCode = PermissionCode.WRITE)
    public RestResponse<Boolean> deleteUser(@Valid @RequestBody UserDelete userDelete) {
        userService.deleteUser(userDelete);
        return RestResponse.ofSuccess(true);
    }

    @Operation(summary = "Operate Users")
    @PostMapping("/operation")
    @Authorize(menuId = MenuId.USER_MANAGEMENT, permissionCode = PermissionCode.WRITE)
    public RestResponse<Boolean> operationUsers(@Valid @RequestBody UserOperation userOperation) {
        userService.operateUsers(userOperation);
        return RestResponse.ofSuccess(true);
    }
}

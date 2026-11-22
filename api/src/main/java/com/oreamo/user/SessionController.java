package com.oreamo.user;

import java.util.List;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import com.oreamo.authority.PermissionService;
import com.oreamo.authority.model.PermissionsSearch;
import com.oreamo.authority.model.RolePermission;
import com.oreamo.common.dto.RestResponse;
import com.oreamo.core.security.AuthenticationHandler;
import com.oreamo.user.model.SessionUser;
import com.oreamo.user.model.SessionUserInfo;
import com.oreamo.user.model.User;
import com.oreamo.user.model.UserPasswordChange;
import com.oreamo.user.model.UserProfileImage;
import com.oreamo.user.model.UserSearch;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@Tag(name = "Session", description = "Session API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/session")
public class SessionController {

    private final SessionService sessionService;

    private final UserService userService;

    private final PermissionService permissionService;

    private final AuthenticationHandler authenticationHandler;

    @Operation(summary = "Get Session Info", description = "Get information about authenticated session user")
    @GetMapping("/user-info")
    public RestResponse<SessionUserInfo> getSessionUserInfo(@AuthenticationPrincipal SessionUser sessionUser) {
        List<RolePermission> rolePermissions =
                permissionService.getRolePermissions(PermissionsSearch.ofEnabledRoleCode(sessionUser.getRoleCode()));
        UserSearch userSearch = UserSearch.ofUsername(sessionUser.getUsername());
        User user = userService.getUser(userSearch);
        UserProfileImage userProfileImage = userService.getUserProfileImage(userSearch);
        SessionUserInfo sessionUserInfo = sessionUser.toPublicInfo(user, rolePermissions, userProfileImage);
        return RestResponse.ofSuccess(sessionUserInfo);
    }

    @Operation(
            summary = "Refresh Session",
            description = "Reissue access and refresh tokens using a valid refresh token")
    @PutMapping("/refresh")
    public RestResponse<Void> refresh() {
        return RestResponse.ofSuccess(null);
    }

    @Operation(
            summary = "Put Session Password",
            description = "Change password of user who should change the password before login")
    @PutMapping("/password")
    public RestResponse<Void> putPassword(@Valid @RequestBody UserPasswordChange userPasswordChange) {
        userService.changeUserPassword(userPasswordChange);
        return RestResponse.ofSuccess(null);
    }

    @Operation(summary = "Logout", description = "Invalidate session and remove token cookies")
    @DeleteMapping
    public RestResponse<Boolean> logout(
            @AuthenticationPrincipal SessionUser sessionUser, HttpServletResponse response) {
        sessionService.logout(sessionUser.getUsername());
        authenticationHandler.removeAccessTokenCookie(response);
        authenticationHandler.removeRefreshTokenCookie(response);
        return RestResponse.ofSuccess(true);
    }
}

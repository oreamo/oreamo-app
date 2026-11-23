package com.oreamo.user;

import jakarta.validation.Valid;

import com.oreamo.common.dto.RestResponse;
import com.oreamo.user.model.UserProfileImageDelete;
import com.oreamo.user.model.UserProfileImageUpdate;
import com.oreamo.user.model.UserSessionPasswordChange;
import com.oreamo.user.model.UserSessionUpdate;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@Tag(name = "User Session", description = "User Session API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/user-session")
public class UserSessionController {

    private final UserService userService;

    @Operation(summary = "Put Session Password", description = "Change password of authenticated session user")
    @PutMapping("/password")
    public RestResponse<Void> putPassword(@Valid @RequestBody UserSessionPasswordChange userSessionPasswordChange) {
        userService.changeUserPassword(userSessionPasswordChange.toUserPasswordChange());
        return RestResponse.ofSuccess(null);
    }

    @Operation(summary = "Put User Session", description = "Set name and email of authenticated session user")
    @PutMapping
    public RestResponse<Void> putUserSession(@Valid @RequestBody UserSessionUpdate userSessionUpdate) {
        userService.updateUser(userSessionUpdate.toUserUpdate());
        return RestResponse.ofSuccess(null);
    }

    @Operation(summary = "Put Session Profile Image", description = "Set profile image of authenticated session user")
    @PutMapping("/profile-image")
    public RestResponse<Void> putProfileImage(@Valid @RequestBody UserProfileImageUpdate userProfileImageUpdate) {
        userService.updateUserProfileImage(userProfileImageUpdate);
        return RestResponse.ofSuccess(null);
    }

    @Operation(
            summary = "Delete Session Profile Image",
            description = "Remove profile image of authenticated session user")
    @DeleteMapping("/profile-image")
    public RestResponse<Boolean> deleteProfileImage(@ModelAttribute UserProfileImageDelete userProfileImageDelete) {
        userService.deleteUserProfileImage(userProfileImageDelete);
        return RestResponse.ofSuccess(true);
    }
}

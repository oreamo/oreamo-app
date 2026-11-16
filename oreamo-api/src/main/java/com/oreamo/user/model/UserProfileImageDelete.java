package com.oreamo.user.model;

import com.oreamo.common.model.OperationAuthor;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserProfileImageDelete extends OperationAuthor {

    public UserProfileImageUpdate toUserProfileImageUpdate() {
        UserProfileImageUpdate userProfileImageUpdate = new UserProfileImageUpdate();
        userProfileImageUpdate.setAuthor(getAuthor());
        return userProfileImageUpdate;
    }
}

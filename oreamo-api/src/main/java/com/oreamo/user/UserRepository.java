package com.oreamo.user;

import java.util.Optional;

import com.oreamo.user.model.User;
import com.oreamo.user.model.UserDelete;
import com.oreamo.user.model.UserProfileImageUpdate;
import com.oreamo.user.model.UserSave;
import com.oreamo.user.model.UserSearch;
import com.oreamo.user.model.UserUpdate;
import com.oreamo.user.model.UsersSearch;
import com.github.pagehelper.Page;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRepository {

    Optional<User> selectUser(UserSearch userSearch);

    Page<User> selectUsers(UsersSearch usersSearch);

    int insertUser(UserSave userSave);

    int updateUser(UserUpdate userUpdate);

    int updateUserProfileImage(UserProfileImageUpdate userProfileImageUpdate);

    int deleteUser(UserDelete userDelete);
}

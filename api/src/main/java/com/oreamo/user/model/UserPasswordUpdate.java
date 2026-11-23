package com.oreamo.user.model;

import com.oreamo.common.model.OperationAuthor;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserPasswordUpdate extends OperationAuthor {

    private String username;

    private String password;

    private boolean passwordChanged;
}

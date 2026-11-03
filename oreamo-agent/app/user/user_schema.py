from typing import Annotated

from pydantic import Field
from pydantic.json_schema import SkipJsonSchema

from app.common.schema import DataRecord, Pagination, RequestSchema, Schema
from app.common.translation_key import TranslationKey
from app.common.validation import Label, NotBlankStr
from app.file.file_schema import FileInfo


class User(DataRecord):
    username: str
    password: SkipJsonSchema[str | None] = Field(default=None, exclude=True)
    role_code: str
    profile_image_file_group_id: str | None = None

    def has_profile_image(self) -> bool:
        return bool(
            self.profile_image_file_group_id
            and self.profile_image_file_group_id.strip()
        )


class UserProfileImage(Schema):
    file_group_id: str | None = Field(
        default=None, description="Profile Image File Group ID"
    )
    file_id: str | None = Field(default=None, description="Profile Image File ID")

    @classmethod
    def of_empty(cls) -> UserProfileImage:
        return cls()

    @classmethod
    def of_file_group_id(cls, file_group_id: str) -> UserProfileImage:
        return cls(file_group_id=file_group_id)

    @classmethod
    def of_file_info(cls, file_group_id: str, file_info: FileInfo) -> UserProfileImage:
        return cls(file_group_id=file_group_id, file_id=file_info.file_id)


class UserSearch(RequestSchema):
    username: str | None = Field(default=None, description="Username")

    @classmethod
    def of_username(cls, username: str) -> UserSearch:
        return cls(username=username)


class UsersSearch(Pagination):
    username: str | None = Field(default=None, description="Username")
    role_code: str | None = Field(default=None, description="Role Code")
    data_status: str | None = Field(default=None, description="Data Status")

    @classmethod
    def of_role_code(cls, role_code: str) -> UsersSearch:
        return cls(role_code=role_code)


class UserSave(RequestSchema):
    username: Annotated[NotBlankStr, Label(TranslationKey.User.Label.USERNAME)] = Field(
        min_length=6, max_length=50, description="Username"
    )
    password: str | None = Field(
        default=None, description="Password (initial password is used when empty)"
    )
    role_code: Annotated[NotBlankStr, Label(TranslationKey.Authority.Label.ROLE)] = (
        Field(description="Role Code", examples=["ROLE_USER"])
    )
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status", examples=["ENABLED"])


class UserUpdate(RequestSchema):
    username: Annotated[NotBlankStr, Label(TranslationKey.User.Label.USERNAME)] = Field(
        description="Username"
    )
    role_code: Annotated[NotBlankStr, Label(TranslationKey.Authority.Label.ROLE)] = (
        Field(description="Role Code", examples=["ROLE_USER"])
    )
    data_status: Annotated[str, Label(TranslationKey.Common.Label.DATA_STATUS)] = Field(
        description="Data Status", examples=["ENABLED"]
    )


class UserPasswordReset(RequestSchema):
    username: Annotated[NotBlankStr, Label(TranslationKey.User.Label.USERNAME)] = Field(
        description="Username"
    )


class UserDelete(RequestSchema):
    username: Annotated[NotBlankStr, Label(TranslationKey.User.Label.USERNAME)] = Field(
        description="Username"
    )


class UserOperation(RequestSchema):
    user_saves: list[UserSave] | None = None
    user_updates: list[UserUpdate] | None = None
    user_deletes: list[UserDelete] | None = None


class UserProfileImageUpdate(RequestSchema):
    file_group_id: Annotated[
        NotBlankStr, Label(TranslationKey.User.Label.PROFILE_IMAGE)
    ] = Field(description="Profile Image File Group ID")

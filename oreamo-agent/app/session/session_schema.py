from pydantic import Field

from app.common.schema import RequestSchema, Schema
from app.user.user_schema import UserProfileImage


class SessionUser(Schema):
    username: str
    role_code: str

    def to_public_info(
        self, permission_codes: list[str], user_profile_image: UserProfileImage
    ) -> SessionUserInfo:
        return SessionUserInfo(
            username=self.username,
            role_code=self.role_code,
            permission_codes=permission_codes,
            profile_image_file_group_id=user_profile_image.file_group_id,
            profile_image_file_id=user_profile_image.file_id,
        )


class SessionUserInfo(Schema):
    username: str = Field(description="Username", examples=["oreamo-admin"])
    role_code: str = Field(description="Role Code", examples=["ROLE_ADMIN"])
    permission_codes: list[str] = Field(
        description="Permission Codes", examples=[["MAIN_READ"]]
    )
    profile_image_file_group_id: str | None = Field(
        default=None, description="Profile Image File Group ID"
    )
    profile_image_file_id: str | None = Field(
        default=None, description="Profile Image File ID"
    )


class LoginRequest(RequestSchema):
    username: str | None = Field(default=None, description="Username")
    password: str | None = Field(default=None, description="Password")

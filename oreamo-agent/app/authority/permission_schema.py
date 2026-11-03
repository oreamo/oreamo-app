from collections.abc import Collection
from enum import StrEnum
from typing import Annotated

from pydantic import Field

from app.common.enums import DataStatus
from app.common.schema import DataRecord, Pagination, RequestSchema, Schema
from app.common.translation_key import TranslationKey
from app.common.validation import Label, NotBlankStr


class PermissionCode(StrEnum):
    MAIN_READ = "MAIN_READ"
    CODE_MANAGEMENT_READ = "CODE_MANAGEMENT_READ"
    CODE_MANAGEMENT_WRITE = "CODE_MANAGEMENT_WRITE"
    MENU_MANAGEMENT_READ = "MENU_MANAGEMENT_READ"
    MENU_MANAGEMENT_WRITE = "MENU_MANAGEMENT_WRITE"
    USER_MANAGEMENT_READ = "USER_MANAGEMENT_READ"
    USER_MANAGEMENT_WRITE = "USER_MANAGEMENT_WRITE"
    AUTHORITY_MANAGEMENT_READ = "AUTHORITY_MANAGEMENT_READ"
    AUTHORITY_MANAGEMENT_WRITE = "AUTHORITY_MANAGEMENT_WRITE"
    TRANSLATION_MANAGEMENT_READ = "TRANSLATION_MANAGEMENT_READ"
    TRANSLATION_MANAGEMENT_WRITE = "TRANSLATION_MANAGEMENT_WRITE"
    DEV_READ = "DEV_READ"

    def is_granted_in(self, granted_permission_codes: Collection[str]) -> bool:
        return self.value in granted_permission_codes


class Permission(DataRecord):
    permission_code: str = Field(description="Permission Code")
    permission_name: str = Field(description="Permission Name")
    sort_order: int = Field(description="Sort Order")

    def to_permission_info(self) -> PermissionInfo:
        return PermissionInfo(
            permission_code=self.permission_code,
            permission_name=self.permission_name,
        )


class PermissionInfo(Schema):
    permission_code: str = Field(description="Permission Code")
    permission_name: str = Field(description="Permission Name")


class PermissionSearch(RequestSchema):
    permission_code: str | None = Field(default=None, description="Permission Code")

    @classmethod
    def of_permission_code(cls, permission_code: str) -> PermissionSearch:
        return cls(permission_code=permission_code)


class PermissionsSearch(Pagination):
    role_code: str | None = Field(
        default=None, description="Role Code", examples=["ROLE_ADMIN"]
    )
    data_status: str | None = Field(
        default=None, description="Data Status", examples=["ENABLED"]
    )

    @classmethod
    def of_enabled(cls) -> PermissionsSearch:
        return cls(data_status=DataStatus.ENABLED.value)

    @classmethod
    def of_enabled_role_code(cls, role_code: str) -> PermissionsSearch:
        return cls(role_code=role_code, data_status=DataStatus.ENABLED.value)


class PermissionSave(RequestSchema):
    permission_code: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.PERMISSION_CODE)
    ] = Field(description="Permission Code", examples=["USER_MANAGEMENT_READ"])
    permission_name: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.PERMISSION_NAME)
    ] = Field(description="Permission Name")
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status", examples=["ENABLED"])
    sort_order: Annotated[int, Label(TranslationKey.Common.Label.SORT_ORDER)] = Field(
        ge=1, description="Sort Order"
    )


class PermissionUpdate(RequestSchema):
    permission_code: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.PERMISSION_CODE)
    ] = Field(description="Permission Code", examples=["USER_MANAGEMENT_READ"])
    permission_name: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.PERMISSION_NAME)
    ] = Field(description="Permission Name")
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status", examples=["ENABLED"])
    sort_order: Annotated[int, Label(TranslationKey.Common.Label.SORT_ORDER)] = Field(
        ge=1, description="Sort Order"
    )


class PermissionDelete(RequestSchema):
    permission_code: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.PERMISSION_CODE)
    ] = Field(description="Permission Code")


class PermissionOperation(RequestSchema):
    permission_saves: list[PermissionSave] | None = None
    permission_updates: list[PermissionUpdate] | None = None
    permission_deletes: list[PermissionDelete] | None = None

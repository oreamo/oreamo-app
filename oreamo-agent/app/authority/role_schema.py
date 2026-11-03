from typing import Annotated

from pydantic import Field

from app.common.enums import DataStatus
from app.common.schema import DataRecord, Pagination, RequestSchema, Schema
from app.common.translation_key import TranslationKey
from app.common.validation import Label, NotBlankStr


class Role(DataRecord):
    role_code: str = Field(description="Role Code")
    role_name: str = Field(description="Role Name")
    sort_order: int = Field(description="Sort Order")
    permission_codes: list[str] | None = Field(
        default=None, description="Permission Codes"
    )

    def has_permission_codes(self) -> bool:
        return bool(self.permission_codes)

    def to_role_info(self) -> RoleInfo:
        return RoleInfo(role_code=self.role_code, role_name=self.role_name)


class RoleInfo(Schema):
    role_code: str = Field(description="Role Code")
    role_name: str = Field(description="Role Name")


class RoleSearch(RequestSchema):
    role_code: str | None = Field(default=None, description="Role Code")

    @classmethod
    def of_role_code(cls, role_code: str) -> RoleSearch:
        return cls(role_code=role_code)


class RolesSearch(Pagination):
    role_name: str | None = Field(default=None, description="Role Name")
    permission_codes: list[str] | None = Field(
        default=None, description="Permission Codes"
    )
    data_status: str | None = Field(
        default=None, description="Data Status", examples=["ENABLED"]
    )

    @classmethod
    def of_enabled(cls) -> RolesSearch:
        return cls(data_status=DataStatus.ENABLED.value)


class RoleSave(RequestSchema):
    role_code: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.ROLE_CODE)
    ] = Field(description="Role Code", examples=["ROLE_USER"])
    role_name: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.ROLE_NAME)
    ] = Field(description="Role Name")
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status", examples=["ENABLED"])
    sort_order: Annotated[int, Label(TranslationKey.Common.Label.SORT_ORDER)] = Field(
        ge=1, description="Sort Order"
    )
    permission_codes: list[str] | None = Field(
        default=None, description="Permission Codes"
    )


class RoleUpdate(RequestSchema):
    role_code: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.ROLE_CODE)
    ] = Field(description="Role Code", examples=["ROLE_USER"])
    role_name: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.ROLE_NAME)
    ] = Field(description="Role Name")
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status", examples=["ENABLED"])
    sort_order: Annotated[int, Label(TranslationKey.Common.Label.SORT_ORDER)] = Field(
        ge=1, description="Sort Order"
    )
    permission_codes: list[str] | None = Field(
        default=None,
        description="Permission Codes (permission mapping is not changed when null)",
    )

    def is_permission_codes_replaced(self) -> bool:
        return self.permission_codes is not None


class RoleDelete(RequestSchema):
    role_code: Annotated[
        NotBlankStr, Label(TranslationKey.Authority.Label.ROLE_CODE)
    ] = Field(description="Role Code")


class RoleOperation(RequestSchema):
    role_saves: list[RoleSave] | None = None
    role_updates: list[RoleUpdate] | None = None
    role_deletes: list[RoleDelete] | None = None

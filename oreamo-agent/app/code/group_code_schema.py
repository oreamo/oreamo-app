from typing import Annotated

from pydantic import Field

from app.code.common_code_schema import CommonCode
from app.common.schema import DataRecord, Pagination, RequestSchema
from app.common.translation_key import TranslationKey
from app.common.validation import Label, NotBlankStr


class GroupCode(DataRecord):
    group_code: str = Field(description="Group Code")
    group_code_name: str = Field(description="Group Code Name")
    group_code_description: str | None = Field(
        default=None, description="Group Code Description"
    )
    sort_order: int = Field(description="Sort Order")
    common_codes: list[CommonCode] | None = Field(
        default=None, description="Common Code List"
    )

    def has_enabled_common_codes(self) -> bool:
        return any(common_code.enabled for common_code in self.common_codes or [])

    def has_common_codes(self) -> bool:
        return bool(self.common_codes)


class GroupCodeSearch(RequestSchema):
    group_code: str | None = Field(default=None, description="Group Code")
    data_status: str | None = Field(default=None, description="Data Status")

    @classmethod
    def of_group_code(
        cls, group_code: str, data_status: str | None = None
    ) -> GroupCodeSearch:
        return cls(group_code=group_code, data_status=data_status)


class GroupCodesSearch(Pagination):
    group_codes: list[str] | None = Field(default=None, description="Group Codes")
    group_code: str | None = Field(default=None, description="Group Code")
    group_code_name: str | None = Field(default=None, description="Group Code Name")
    common_code_name: str | None = Field(default=None, description="Common Code Name")
    data_status: str | None = Field(default=None, description="Data Status")
    include_common_codes: bool = Field(
        default=False, description="Include Common Codes in Result"
    )


class GroupCodeSave(RequestSchema):
    group_code: Annotated[NotBlankStr, Label(TranslationKey.Code.Label.GROUP_CODE)] = (
        Field(description="Group Code")
    )
    group_code_name: Annotated[
        NotBlankStr, Label(TranslationKey.Code.Label.GROUP_CODE_NAME)
    ] = Field(description="Group Code Name")
    group_code_description: str | None = Field(
        default=None, description="Group Code Description"
    )
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status")
    sort_order: Annotated[int, Label(TranslationKey.Common.Label.SORT_ORDER)] = Field(
        ge=1, description="Sort Order"
    )


class GroupCodeUpdate(RequestSchema):
    group_code: Annotated[NotBlankStr, Label(TranslationKey.Code.Label.GROUP_CODE)] = (
        Field(description="Group Code", examples=["USAGE"])
    )
    group_code_name: Annotated[
        NotBlankStr, Label(TranslationKey.Code.Label.GROUP_CODE_NAME)
    ] = Field(
        min_length=1, max_length=100, description="Group Code Name", examples=["Usage"]
    )
    group_code_description: str | None = Field(
        default=None, description="Group Code Description"
    )
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status", examples=["ENABLED"])

    def has_data_status_changed(self, group_code: GroupCode) -> bool:
        return self.data_status != group_code.data_status


class GroupCodeDelete(RequestSchema):
    group_code: Annotated[NotBlankStr, Label(TranslationKey.Code.Label.GROUP_CODE)] = (
        Field(description="Group Code")
    )


class GroupCodeOperation(RequestSchema):
    group_code_saves: list[GroupCodeSave] | None = None
    group_code_updates: list[GroupCodeUpdate] | None = None
    group_code_deletes: list[GroupCodeDelete] | None = None

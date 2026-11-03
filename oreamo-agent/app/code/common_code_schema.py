from typing import Annotated

from pydantic import Field

from app.common.enums import DataStatus
from app.common.schema import DataRecord, Pagination, RequestSchema, Schema
from app.common.translation_key import TranslationKey
from app.common.validation import Label, NotBlankStr


class CommonCode(DataRecord):
    group_code: str = Field(description="Group Code")
    common_code: str = Field(description="Common Code")
    common_code_name: str = Field(description="Common Code Name")
    common_code_description: str | None = Field(
        default=None, description="Common Code Description"
    )
    sort_order: int = Field(description="Sort Order")

    def to_common_code_info(self) -> CommonCodeInfo:
        return CommonCodeInfo(
            group_code=self.group_code,
            common_code=self.common_code,
            common_code_name=self.common_code_name,
        )


class CommonCodeInfo(Schema):
    group_code: str = Field(description="Group Code")
    common_code: str = Field(description="Common Code")
    common_code_name: str = Field(description="Common Code Name")


class CommonCodeSearch(RequestSchema):
    group_code: Annotated[NotBlankStr, Label(TranslationKey.Code.Label.GROUP_CODE)] = (
        Field(description="Group Code")
    )
    common_code: str | None = Field(default=None, description="Common Code")
    data_status: str | None = Field(default=None, description="Data Status")

    @classmethod
    def of_code(cls, group_code: str, common_code: str) -> CommonCodeSearch:
        return cls(group_code=group_code, common_code=common_code)


class CommonCodesSearch(Pagination):
    group_code: str | None = Field(default=None, description="Group Code")
    group_codes: list[str] | None = Field(default=None, description="Group Codes")
    common_code: str | None = Field(default=None, description="Common Code")
    data_status: str | None = Field(
        default=None, description="Data Status", examples=["ENABLED"]
    )

    @classmethod
    def of_enabled_group_codes(cls, group_codes: list[str]) -> CommonCodesSearch:
        return cls(group_codes=group_codes, data_status=DataStatus.ENABLED.value)


class CommonCodeSave(RequestSchema):
    group_code: Annotated[NotBlankStr, Label(TranslationKey.Code.Label.GROUP_CODE)] = (
        Field(description="Group Code")
    )
    common_code: Annotated[
        NotBlankStr, Label(TranslationKey.Code.Label.COMMON_CODE)
    ] = Field(description="Common Code")
    common_code_name: Annotated[
        NotBlankStr, Label(TranslationKey.Code.Label.COMMON_CODE_NAME)
    ] = Field(description="Common Code Name")
    common_code_description: str | None = Field(
        default=None, description="Common Code Description"
    )
    data_status: Annotated[str, Label(TranslationKey.Common.Label.DATA_STATUS)] = Field(
        description="Data Status", examples=["ENABLED"]
    )
    sort_order: Annotated[int, Label(TranslationKey.Common.Label.SORT_ORDER)] = Field(
        ge=1, description="Sort Order"
    )


class CommonCodeUpdate(RequestSchema):
    group_code: Annotated[NotBlankStr, Label(TranslationKey.Code.Label.GROUP_CODE)] = (
        Field(description="Group Code")
    )
    common_code: Annotated[
        NotBlankStr, Label(TranslationKey.Code.Label.COMMON_CODE)
    ] = Field(description="Common Code")
    common_code_name: Annotated[
        NotBlankStr, Label(TranslationKey.Code.Label.COMMON_CODE_NAME)
    ] = Field(min_length=1, max_length=100, description="Common Code Name")
    common_code_description: str | None = Field(
        default=None, description="Common Code Description"
    )
    data_status: Annotated[str, Label(TranslationKey.Common.Label.DATA_STATUS)] = Field(
        description="Data Status", examples=["ENABLED"]
    )


class CommonCodeDelete(RequestSchema):
    group_code: Annotated[NotBlankStr, Label(TranslationKey.Code.Label.GROUP_CODE)] = (
        Field(description="Group Code")
    )
    common_code: Annotated[
        NotBlankStr, Label(TranslationKey.Code.Label.COMMON_CODE)
    ] = Field(description="Common Code")


class CommonCodeOperation(RequestSchema):
    common_code_saves: list[CommonCodeSave] | None = None
    common_code_updates: list[CommonCodeUpdate] | None = None
    common_code_deletes: list[CommonCodeDelete] | None = None

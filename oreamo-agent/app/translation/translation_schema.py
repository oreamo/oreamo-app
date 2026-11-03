from typing import Annotated

from pydantic import Field, computed_field

from app.common.enums import DataStatus
from app.common.schema import DataRecord, Pagination, RequestSchema, Schema
from app.common.translation_key import TranslationKey
from app.common.validation import Label, NotBlankStr


class Translation(DataRecord):
    translation_group: str = Field(description="Translation Group")
    translation_type: str = Field(description="Translation Type")
    translation_code: str = Field(description="Translation Code")
    translation_locale: str = Field(description="Translation Locale")
    translation_content: str = Field(description="Translation Content")

    def to_translation_info(self) -> TranslationInfo:
        return TranslationInfo(
            translation_group=self.translation_group,
            translation_type=self.translation_type,
            translation_code=self.translation_code,
            translation_content=self.translation_content,
        )


class TranslationInfo(Schema):
    translation_group: str = Field(description="Translation Group")
    translation_type: str = Field(description="Translation Type")
    translation_code: str = Field(description="Translation Code")
    translation_content: str = Field(description="Translation Content")

    @computed_field(description="Translation Key(group.type.code)")
    @property
    def translation_key(self) -> str:
        return f"{self.translation_group.lower()}.{self.translation_type.lower()}.{self.translation_code}"


class TranslationSearch(Pagination):
    translation_group: str | None = Field(default=None, description="Translation Group")
    translation_type: str | None = Field(default=None, description="Translation Type")
    translation_code: str | None = Field(default=None, description="Translation Code")
    translation_locale: str | None = Field(
        default=None, description="Translation Locale"
    )
    data_status: str | None = Field(default=None, description="Data Status")
    translation_key: str | None = Field(
        default=None, description="Translation Key(group.type.code)"
    )

    @classmethod
    def of_enabled(cls) -> TranslationSearch:
        return cls(data_status=DataStatus.ENABLED.value)

    @classmethod
    def of_key(
        cls,
        translation_group: str,
        translation_type: str,
        translation_code: str,
        translation_locale: str,
    ) -> TranslationSearch:
        return cls(
            translation_group=translation_group,
            translation_type=translation_type,
            translation_code=translation_code,
            translation_locale=translation_locale,
        )


class TranslationSave(RequestSchema):
    translation_group: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_GROUP)
    ] = Field(description="Translation Group")
    translation_type: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_TYPE)
    ] = Field(description="Translation Type")
    translation_code: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_CODE)
    ] = Field(description="Translation Code")
    translation_locale: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_LOCALE)
    ] = Field(description="Translation Locale")
    translation_content: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_CONTENT)
    ] = Field(description="Translation Content")
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status")


class TranslationUpdate(RequestSchema):
    translation_group: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_GROUP)
    ] = Field(description="Translation Group")
    translation_type: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_TYPE)
    ] = Field(description="Translation Type")
    translation_code: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_CODE)
    ] = Field(description="Translation Code")
    translation_locale: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_LOCALE)
    ] = Field(description="Translation Locale")
    translation_content: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_CONTENT)
    ] = Field(description="Translation Content")
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status")


class TranslationDelete(RequestSchema):
    translation_group: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_GROUP)
    ] = Field(description="Translation Group")
    translation_type: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_TYPE)
    ] = Field(description="Translation Type")
    translation_code: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_CODE)
    ] = Field(description="Translation Code")
    translation_locale: Annotated[
        NotBlankStr, Label(TranslationKey.Translation.Label.TRANSLATION_LOCALE)
    ] = Field(description="Translation Locale")


class TranslationOperation(RequestSchema):
    translation_saves: list[TranslationSave] | None = None
    translation_updates: list[TranslationUpdate] | None = None
    translation_deletes: list[TranslationDelete] | None = None

from datetime import datetime
from typing import Any, Self

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    ModelWrapValidatorHandler,
    ValidationError,
    computed_field,
    model_validator,
)
from pydantic.alias_generators import to_camel

from app.common.enums import DataStatus
from app.common.validation import translate_validation_error


class Schema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_name=True,
        validate_by_alias=True,
        from_attributes=True,
    )


class RequestSchema(Schema):
    """Request schema whose first validation error is translated into a failure message/label key."""

    @model_validator(mode="wrap")
    @classmethod
    def translate_failure(
        cls, data: Any, handler: ModelWrapValidatorHandler[Self]
    ) -> Self:
        try:
            return handler(data)
        except ValidationError as exception:
            raise translate_validation_error(
                model=cls, error=exception.errors()[0]
            ) from exception


class DataRecord(Schema):
    data_status: str = Field(
        default=DataStatus.ENABLED.value, description="Data Status"
    )
    created_by: str = Field(
        default="oreamo-system", description="Creator", examples=["oreamo-system"]
    )
    created_at: datetime = Field(
        default_factory=datetime.now,
        description="Created Date Time",
        examples=["2024-01-01T12:00:00"],
    )
    updated_by: str = Field(
        default="oreamo-system", description="Updator", examples=["oreamo-system"]
    )
    updated_at: datetime = Field(
        default_factory=datetime.now,
        description="Updated Date Time",
        examples=["2024-01-02T12:00:00"],
    )

    @computed_field
    @property
    def enabled(self) -> bool:
        return self.data_status == DataStatus.ENABLED


class Pagination(RequestSchema):
    page_num: int | None = Field(default=None, description="Page Number")
    page_size: int | None = Field(default=None, description="Page Size")

    def is_pageable(self) -> bool:
        return (
            self.page_num is not None
            and self.page_num > 0
            and self.page_size is not None
            and self.page_size > 0
        )


class Failure(Schema):
    failure_message_key: str = Field(description="Failure message key")
    failure_label_keys: list[str] = Field(default=[], description="Failure label keys")

    @classmethod
    def of(cls, failure_message_key: str, *failure_label_keys: str) -> Failure:
        return cls(
            failure_message_key=failure_message_key,
            failure_label_keys=list(failure_label_keys),
        )


class RestResponse[T](Schema):
    succeed: bool = Field(description="Succeed or Failure")
    data: T | None = Field(default=None, description="Response data")
    failure: Failure | None = Field(default=None, description="Failure")

    @classmethod
    def of_success(cls, data: T) -> RestResponse[T]:
        return cls(succeed=True, data=data)

    @classmethod
    def of_failure(cls, failure: Failure) -> RestResponse[T]:
        return cls(succeed=False, failure=failure)


class PageResponse[T](Schema):
    page_num: int = Field(description="Page Number")
    page_size: int = Field(description="Page Size")
    pages: int = Field(description="Total Pages")
    total: int = Field(description="Total Count")
    items: list[T] = Field(alias="list", description="Data List")

from dataclasses import dataclass
from typing import Annotated

from annotated_types import MaxLen, MinLen
from pydantic import BaseModel, Field
from pydantic.fields import FieldInfo
from pydantic_core import ErrorDetails, PydanticCustomError

from app.common.translation_key import TranslationKey

VALIDATION_FAILURE = "validation_failure"


@dataclass(frozen=True)
class Label:
    """Translation label key of a request field, reported as the failure label when validation fails."""

    key: str


NotBlankStr = Annotated[str, Field(pattern=r"\S")]


def translate_validation_error(
    *, model: type[BaseModel], error: ErrorDetails
) -> PydanticCustomError:
    if error["type"] == VALIDATION_FAILURE:
        failure_message_key, failure_label_keys = get_failure_keys(error)
        return _failure(failure_message_key, *failure_label_keys)

    field = _find_field(model, error["loc"])
    label_key = _find_label_key(field)
    if field is None or label_key is None:
        return _failure(TranslationKey.Common.Message.REQUEST_VALIDATION_FAILURE)

    error_type = error["type"]
    if (
        error_type in ("missing", "string_pattern_mismatch")
        or error.get("input") is None
    ):
        return _failure(
            TranslationKey.Common.Message.REQUIRED_VALIDATION_FAILURE, label_key
        )
    if error_type in ("string_too_short", "string_too_long"):
        return _translate_size(field, label_key)
    if error_type == "greater_than_equal":
        return _failure(
            TranslationKey.Common.Message.MIN_SIZE_VALIDATION_FAILURE,
            label_key,
            str(error.get("ctx", {}).get("ge")),
        )
    if error_type == "less_than_equal":
        return _failure(
            TranslationKey.Common.Message.MAX_SIZE_VALIDATION_FAILURE,
            label_key,
            str(error.get("ctx", {}).get("le")),
        )
    return _failure(TranslationKey.Common.Message.REQUEST_VALIDATION_FAILURE)


def get_failure_keys(error: ErrorDetails) -> tuple[str, list[str]]:
    if error["type"] != VALIDATION_FAILURE:
        return TranslationKey.Common.Message.REQUEST_VALIDATION_FAILURE, []
    ctx = error.get("ctx", {})
    return ctx["failure_message_key"], list(ctx["failure_label_keys"])


def _failure(failure_message_key: str, *failure_label_keys: str) -> PydanticCustomError:
    return PydanticCustomError(
        VALIDATION_FAILURE,
        "{failure_message_key}",
        {
            "failure_message_key": failure_message_key,
            "failure_label_keys": list(failure_label_keys),
        },
    )


def _find_field(model: type[BaseModel], loc: tuple[int | str, ...]) -> FieldInfo | None:
    if not loc:
        return None
    for field_name, field in model.model_fields.items():
        if loc[0] in (field_name, field.alias):
            return field
    return None


def _find_label_key(field: FieldInfo | None) -> str | None:
    if field is None:
        return None
    return next((m.key for m in field.metadata if isinstance(m, Label)), None)


def _translate_size(field: FieldInfo, label_key: str) -> PydanticCustomError:
    min_length = next(
        (m.min_length for m in field.metadata if isinstance(m, MinLen)), 0
    )
    max_length = next(
        (m.max_length for m in field.metadata if isinstance(m, MaxLen)), None
    )

    if min_length > 0 and max_length is not None:
        return _failure(
            TranslationKey.Common.Message.RANGE_SIZE_VALIDATION_FAILURE,
            label_key,
            str(min_length),
            str(max_length),
        )
    if min_length > 0:
        return _failure(
            TranslationKey.Common.Message.MIN_SIZE_VALIDATION_FAILURE,
            label_key,
            str(min_length),
        )
    if max_length is not None:
        return _failure(
            TranslationKey.Common.Message.MAX_SIZE_VALIDATION_FAILURE,
            label_key,
            str(max_length),
        )
    return _failure(TranslationKey.Common.Message.REQUEST_VALIDATION_FAILURE)

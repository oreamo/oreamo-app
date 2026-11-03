from starlette.exceptions import HTTPException as StarletteHTTPException


class RestException(Exception):
    def __init__(
        self, translation_message_key: str, *translation_label_keys: str
    ) -> None:
        super().__init__(translation_message_key)
        self.translation_message_key = translation_message_key
        self.translation_label_keys = list(translation_label_keys)


class AuthenticationException(Exception):
    def __init__(
        self,
        *,
        failure_message_key: str | None = None,
        remove_token_cookies: bool = True,
    ) -> None:
        super().__init__(failure_message_key)
        self.failure_message_key = failure_message_key
        self.remove_token_cookies = remove_token_cookies


class AccessDeniedException(Exception):
    pass


class UploadSizeExceededException(StarletteHTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=413)

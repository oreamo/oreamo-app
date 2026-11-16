class RestException(Exception):
    def __init__(
        self, translation_message_key: str, *translation_label_keys: str
    ) -> None:
        super().__init__(translation_message_key)
        self.translation_message_key = translation_message_key
        self.translation_label_keys = list(translation_label_keys)

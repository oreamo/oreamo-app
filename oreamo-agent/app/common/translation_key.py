class TranslationKey:
    class Common:
        class Label:
            SORT_ORDER = "common.label.SORT_ORDER"
            DATA_STATUS = "common.label.DATA_STATUS"

        class Message:
            CREATE_FAILURE = "common.message.CREATE_FAILURE"
            UPDATE_FAILURE = "common.message.UPDATE_FAILURE"
            DELETE_FAILURE = "common.message.DELETE_FAILURE"
            DUPLICATE_FAILURE = "common.message.DUPLICATE_FAILURE"
            REQUEST_VALIDATION_FAILURE = "common.message.REQUEST_VALIDATION_FAILURE"
            REQUIRED_VALIDATION_FAILURE = "common.message.REQUIRED_VALIDATION_FAILURE"
            MIN_SIZE_VALIDATION_FAILURE = "common.message.MIN_SIZE_VALIDATION_FAILURE"
            MAX_SIZE_VALIDATION_FAILURE = "common.message.MAX_SIZE_VALIDATION_FAILURE"
            RANGE_SIZE_VALIDATION_FAILURE = (
                "common.message.RANGE_SIZE_VALIDATION_FAILURE"
            )
            INTERNAL_SERVER_ERROR_FAILURE = (
                "common.message.INTERNAL_SERVER_ERROR_FAILURE"
            )
            NOT_FOUND_FAILURE = "common.message.NOT_FOUND_FAILURE"

    class Code:
        class Label:
            GROUP_CODE = "code.label.GROUP_CODE"
            GROUP_CODE_NAME = "code.label.GROUP_CODE_NAME"
            COMMON_CODE = "code.label.COMMON_CODE"
            COMMON_CODE_NAME = "code.label.COMMON_CODE_NAME"

        class Message:
            GROUP_CODE_DELETE_FAILURE_BY_ENABLED_COMMON_CODE = (
                "code.message.GROUP_CODE_DELETE_FAILURE_BY_ENABLED_COMMON_CODE"
            )

    class User:
        class Label:
            USER = "user.label.USER"
            USERNAME = "user.label.USERNAME"
            PASSWORD = "user.label.PASSWORD"
            PROFILE_IMAGE = "user.label.PROFILE_IMAGE"

        class Message:
            AUTHENTICATION_FAILURE = "user.message.AUTHENTICATION_FAILURE"
            AUTHORIZATION_FAILURE = "user.message.AUTHORIZATION_FAILURE"
            PROFILE_IMAGE_TYPE_VALIDATION_FAILURE = (
                "user.message.PROFILE_IMAGE_TYPE_VALIDATION_FAILURE"
            )

    class Authority:
        class Label:
            AUTHORITY = "authority.label.AUTHORITY"
            ROLE = "authority.label.ROLE"
            ROLE_CODE = "authority.label.ROLE_CODE"
            ROLE_NAME = "authority.label.ROLE_NAME"
            PERMISSION = "authority.label.PERMISSION"
            PERMISSION_CODE = "authority.label.PERMISSION_CODE"
            PERMISSION_NAME = "authority.label.PERMISSION_NAME"

        class Message:
            ROLE_DELETE_FAILURE_BY_USER = (
                "authority.message.ROLE_DELETE_FAILURE_BY_USER"
            )

    class Menu:
        class Label:
            MENU = "menu.label.MENU"
            MENU_ID = "menu.label.MENU_ID"
            MENU_NAME = "menu.label.MENU_NAME"
            MENU_TYPE = "menu.label.MENU_TYPE"
            PARENT_MENU_ID = "menu.label.PARENT_MENU_ID"
            URL = "menu.label.URL"
            MENU_PERMISSION_CODE = "menu.label.MENU_PERMISSION_CODE"

        class Message:
            MENU_DELETE_FAILURE_BY_SUB_MENU = (
                "menu.message.MENU_DELETE_FAILURE_BY_SUB_MENU"
            )

    class Translation:
        class Label:
            TRANSLATION_GROUP = "translation.label.TRANSLATION_GROUP"
            TRANSLATION_TYPE = "translation.label.TRANSLATION_TYPE"
            TRANSLATION_CODE = "translation.label.TRANSLATION_CODE"
            TRANSLATION_LOCALE = "translation.label.TRANSLATION_LOCALE"
            TRANSLATION_CONTENT = "translation.label.TRANSLATION_CONTENT"

    class File:
        class Label:
            FILES = "file.label.FILES"

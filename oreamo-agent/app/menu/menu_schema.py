from typing import Annotated

from pydantic import Field

from app.common.schema import DataRecord, Pagination, RequestSchema, Schema
from app.common.translation_key import TranslationKey
from app.common.validation import Label, NotBlankStr


class Menu(DataRecord):
    menu_id: str = Field(description="Menu ID")
    menu_name: str = Field(description="Menu Name")
    menu_type: str = Field(description="Menu Type")
    url: str = Field(description="URL")
    parent_menu_id: str | None = Field(default=None, description="Parent Menu ID")
    menu_permission_code: str | None = Field(
        default=None, description="Menu Permission Code"
    )
    sort_order: int = Field(description="Sort Order")


class MenuTreeNode(Schema):
    menu_id: str = Field(description="Menu ID")
    menu_name: str = Field(description="Menu Name")
    menu_type: str = Field(description="Menu Type")
    parent_menu_id: str | None = Field(default=None, description="Parent Menu ID")
    url: str = Field(description="URL")
    sort_order: int = Field(description="Sort Order")
    sub_menus: list[MenuTreeNode] | None = Field(
        default=None, description="Sub Menu List"
    )


class MenuSearch(RequestSchema):
    menu_id: str | None = Field(default=None, description="Menu ID")
    data_status: str | None = Field(default=None, description="Data Status")

    @classmethod
    def of_menu_id(cls, menu_id: str, data_status: str | None = None) -> MenuSearch:
        return cls(menu_id=menu_id, data_status=data_status)


class MenusSearch(Pagination):
    menu_id: str | None = Field(default=None, description="Menu Id")
    menu_ids: list[str] | None = Field(default=None, description="Menu Ids")
    parent_menu_id: str | None = Field(default=None, description="Parent Menu Id")
    menu_name: str | None = Field(default=None, description="Menu Name")
    menu_type: str | None = Field(
        default=None, description="Menu Type", examples=["GRP_NAV"]
    )
    data_status: str | None = Field(
        default=None, description="Data Status", examples=["ENABLED"]
    )

    @classmethod
    def of_menu_ids(cls, menu_ids: list[str]) -> MenusSearch:
        return cls(menu_ids=menu_ids)

    @classmethod
    def of_parent_menu_id(cls, parent_menu_id: str) -> MenusSearch:
        return cls(parent_menu_id=parent_menu_id)


class MenuSave(RequestSchema):
    menu_id: Annotated[NotBlankStr, Label(TranslationKey.Menu.Label.MENU_ID)] = Field(
        description="Menu ID"
    )
    menu_name: Annotated[NotBlankStr, Label(TranslationKey.Menu.Label.MENU_NAME)] = (
        Field(min_length=1, max_length=100, description="Menu Name")
    )
    menu_type: Annotated[NotBlankStr, Label(TranslationKey.Menu.Label.MENU_TYPE)] = (
        Field(description="Menu Type")
    )
    url: Annotated[NotBlankStr, Label(TranslationKey.Menu.Label.URL)] = Field(
        description="URL"
    )
    parent_menu_id: str | None = Field(default=None, description="Parent Menu ID")
    menu_permission_code: str | None = Field(
        default=None, description="Menu Permission Code"
    )
    sort_order: Annotated[int, Label(TranslationKey.Common.Label.SORT_ORDER)] = Field(
        ge=1, description="Sort Order"
    )
    data_status: Annotated[
        NotBlankStr, Label(TranslationKey.Common.Label.DATA_STATUS)
    ] = Field(description="Data Status")


class MenuUpdate(RequestSchema):
    menu_id: Annotated[NotBlankStr, Label(TranslationKey.Menu.Label.MENU_ID)] = Field(
        description="Menu ID"
    )
    menu_name: Annotated[NotBlankStr, Label(TranslationKey.Menu.Label.MENU_NAME)] = (
        Field(min_length=1, max_length=100, description="Menu Name")
    )
    menu_permission_code: str | None = Field(
        default=None, description="Menu Permission Code"
    )
    data_status: Annotated[str, Label(TranslationKey.Common.Label.DATA_STATUS)] = Field(
        description="Data Status", examples=["ENABLED"]
    )


class MenuDelete(RequestSchema):
    menu_id: Annotated[NotBlankStr, Label(TranslationKey.Menu.Label.MENU_ID)] = Field(
        description="Menu ID"
    )


class MenuOperate(RequestSchema):
    menu_saves: list[MenuSave] | None = None
    menu_updates: list[MenuUpdate] | None = None
    menu_deletes: list[MenuDelete] | None = None

    def get_delete_menu_ids(self) -> list[str]:
        return [menu_delete.menu_id for menu_delete in self.menu_deletes or []]

    def get_menu_saves_sorted_by_hierarchy(self) -> list[MenuSave]:
        menu_saves = self.menu_saves or []
        parent_menu_id_by_menu_id = {
            menu_save.menu_id: menu_save.parent_menu_id for menu_save in menu_saves
        }
        return sorted(
            menu_saves,
            key=lambda menu_save: _depth_within_batch(
                menu_save.menu_id, parent_menu_id_by_menu_id
            ),
        )

    def get_menu_deletes_sorted_by_hierarchy(
        self, parent_menu_ids_of_delete_menus: dict[str, str | None]
    ) -> list[MenuDelete]:
        return sorted(
            self.menu_deletes or [],
            key=lambda menu_delete: _depth_within_batch(
                menu_delete.menu_id, parent_menu_ids_of_delete_menus
            ),
            reverse=True,
        )


def _depth_within_batch(
    menu_id: str, parent_menu_id_by_menu_id: dict[str, str | None]
) -> int:
    depth = 0
    parent_menu_id = parent_menu_id_by_menu_id.get(menu_id)
    while parent_menu_id is not None and parent_menu_id in parent_menu_id_by_menu_id:
        depth += 1
        parent_menu_id = parent_menu_id_by_menu_id.get(parent_menu_id)
    return depth

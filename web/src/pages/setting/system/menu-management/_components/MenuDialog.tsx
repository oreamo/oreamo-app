import { useIcon } from "@/components/common/display/hooks/useIcon";
import { Flex } from "@/components/common/layout/Flex";
import { DetailForm } from "@/components/data-form/components/DetailForm";
import { NumberInputField } from "@/components/data-form/components/NumberInputField";
import { SelectInputField } from "@/components/data-form/components/SelectInputField";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { Menu } from "@/models/menu-model";
import { DetailFormModal } from "@/pages/setting/system/_components/DetailFormModal";
import { MenuIconGuideButton } from "@/pages/setting/system/menu-management/_components/MenuIconGuideButton";
import { useMenu } from "@/resources/menu/useMenu";
import { useMenuDelete } from "@/resources/menu/useMenuDelete";
import { useMenuSave } from "@/resources/menu/useMenuSave";
import { useMenuUpdate } from "@/resources/menu/useMenuUpdate";

interface MenuDialogProps {
  open: boolean;
  menuValue?: string;
  readonly?: boolean;
  onClose: () => void;
}

export function MenuDialog({
  open,
  menuValue,
  readonly = false,
  onClose,
}: MenuDialogProps) {
  const { getCodeOptions: getOptions } = useCodeOptions([
    "DATA_STATUS",
    "MENU_TYPE",
  ]);
  const { translate } = useTranslate();
  const { isIconName } = useIcon();

  const { data: menu, isEnabled: isEditMode } = useMenu({
    menuId: menuValue,
  });

  const { mutate: saveMenu } = useMenuSave();
  const { mutate: updateMenu } = useMenuUpdate({
    menuId: menuValue,
  });
  const { mutate: deleteMenu } = useMenuDelete({
    menuId: menuValue,
  });

  const handleSubmit = (data: Menu, options: { onSuccess: () => void }) => {
    if (isEditMode) {
      updateMenu(
        {
          menuId: data.menuId,
          menuName: data.menuName,
          iconName: data.iconName,
          dataStatus: data.dataStatus,
        },
        options,
      );
      return;
    }

    saveMenu(data, options);
  };

  const handleDelete = (options: { onSuccess: () => void }) => {
    deleteMenu({ menuId: menuValue as string }, options);
  };

  return (
    <DetailFormModal<Menu>
      open={open}
      keyValue={menuValue}
      labelKey={TRANSLATION_KEY.menu.label.MENU}
      formValue={menu ?? ({} as Menu)}
      isEditMode={isEditMode}
      readonly={readonly}
      getTargetValue={(data) => data.menuId}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onClose={onClose}
    >
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.menu.label.MENU_ID)}
        required
      >
        <TextInputField<Menu, "menuId">
          name="menuId"
          label={translate(TRANSLATION_KEY.menu.label.MENU_ID)}
          readonly={isEditMode || readonly}
          required
          maxLength={50}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.menu.label.MENU_NAME)}
        required
      >
        <TextInputField<Menu, "menuName">
          name="menuName"
          label={translate(TRANSLATION_KEY.menu.label.MENU_NAME)}
          required
          readonly={readonly}
          maxLength={100}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.menu.label.MENU_TYPE)}
        required
      >
        <SelectInputField<Menu, "menuType">
          name="menuType"
          label={translate(TRANSLATION_KEY.menu.label.MENU_TYPE)}
          readonly={isEditMode || readonly}
          required
          options={getOptions("MENU_TYPE")}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.menu.label.URL)}
        required
      >
        <TextInputField<Menu, "url">
          name="url"
          label={translate(TRANSLATION_KEY.menu.label.URL)}
          readonly={isEditMode || readonly}
          required
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.menu.label.PARENT_MENU_ID)}
      >
        <TextInputField<Menu, "parentMenuId">
          name="parentMenuId"
          label={translate(TRANSLATION_KEY.menu.label.PARENT_MENU_ID)}
          readonly={isEditMode || readonly}
          maxLength={50}
        />
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.SORT_ORDER)}
        required
      >
        <NumberInputField<Menu, "sortOrder">
          name="sortOrder"
          label={translate(TRANSLATION_KEY.common.label.SORT_ORDER)}
          required
          readonly={readonly}
          renderProps={{
            min: 1,
          }}
        />
      </DetailForm.Item>
      <DetailForm.Item title={translate(TRANSLATION_KEY.menu.label.ICON_NAME)}>
        <Flex gap={1} align="center" fullWidth>
          <Flex direction="column" grow>
            <TextInputField<Menu, "iconName">
              name="iconName"
              label={translate(TRANSLATION_KEY.menu.label.ICON_NAME)}
              readonly={readonly}
              maxLength={50}
              validation={{
                iconName: (value) => {
                  return value && !isIconName(value)
                    ? TRANSLATION_KEY.menu.message.ICON_NAME_VALIDATION_FAILURE
                    : undefined;
                },
              }}
            />
          </Flex>
          <MenuIconGuideButton />
        </Flex>
      </DetailForm.Item>
      <DetailForm.Item
        title={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
        required
      >
        <SelectInputField<Menu, "dataStatus">
          name="dataStatus"
          label={translate(TRANSLATION_KEY.common.label.DATA_STATUS)}
          required
          readonly={readonly}
          options={getOptions("DATA_STATUS")}
        />
      </DetailForm.Item>
    </DetailFormModal>
  );
}

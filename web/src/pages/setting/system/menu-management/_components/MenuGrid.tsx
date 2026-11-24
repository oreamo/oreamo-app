import { useState } from "react";

import dayjs from "dayjs";

import { Card } from "@/components/common/display/Card";
import {
  DataGrid,
  DataGridSaveCallbacks,
  DataGridSavePayload,
} from "@/components/data-grid/DataGrid";
import { DATE_TIME_FORMAT } from "@/constants/date-time-constant";
import { GRID_WIDTH } from "@/constants/foundation-constant";
import { PERMISSION } from "@/constants/permission-constant";
import { ROUTE } from "@/constants/route-constant";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useAuthorization } from "@/hooks/useAuthorization";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { PageInfo } from "@/models/common-model";
import { Menu } from "@/models/menu-model";
import { MenuDialog } from "@/pages/setting/system/menu-management/_components/MenuDialog";
import { MenuIconNameHeader } from "@/pages/setting/system/menu-management/_components/MenuIconNameHeader";
import { useMenuOperation } from "@/resources/menu/useMenuOperation";

interface MenuGridProps {
  rowData?: Menu[];
  pageInfo?: PageInfo<Menu>;
  onPaginationChange?: (page: number) => void;
}

export function MenuGrid({
  rowData = [],
  pageInfo,
  onPaginationChange,
}: MenuGridProps) {
  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [editMenuTarget, setEditMenuTarget] = useState<string>();

  const { getCodeOptions: getOptions, getCodeName: getOptionName } =
    useCodeOptions(["DATA_STATUS", "MENU_TYPE"]);
  const { translate } = useTranslate();

  const { hasPermission } = useAuthorization();
  const doesNotHaveWritePermission = !hasPermission(
    ROUTE.SETTING.SYSTEM_SETTING.MENU_MANAGEMENT.ID,
    PERMISSION.WRITE,
  );

  const { mutate: operateMenus } = useMenuOperation();

  const handleAddMenu = () => {
    setOpenMenuDialog(true);
  };

  const handleSaveMenus = (
    { newRows, editedRows, deletedRows }: DataGridSavePayload<Menu>,
    { onSuccess }: DataGridSaveCallbacks,
  ) => {
    operateMenus(
      {
        menuSaves: newRows.map((row) => ({
          menuId: row.menuId,
          menuName: row.menuName,
          menuType: row.menuType,
          url: row.url,
          parentMenuId: row.parentMenuId,
          sortOrder: row.sortOrder,
          iconName: row.iconName,
          dataStatus: row.dataStatus,
        })),
        menuUpdates: editedRows.map((row) => ({
          menuId: row.menuId,
          menuName: row.menuName,
          iconName: row.iconName,
          dataStatus: row.dataStatus,
        })),
        menuDeletes: deletedRows.map((row) => ({
          menuId: row.menuId,
        })),
      },
      { onSuccess },
    );
  };

  const handleDetailMenu = (data: Menu) => {
    setOpenMenuDialog(true);
    setEditMenuTarget(data.menuId);
  };

  const handleCloseMenuDialog = () => {
    setOpenMenuDialog(false);
    setEditMenuTarget(undefined);
  };

  return (
    <Card>
      <DataGrid<Menu>
        title={translate(TRANSLATION_KEY.menu.label.MENU)}
        visibleRowCount={10}
        readonly={doesNotHaveWritePermission}
        rowData={rowData}
        columnDefs={[
          {
            field: "menuId",
            headerName: translate(TRANSLATION_KEY.menu.label.MENU_ID),
            width: GRID_WIDTH.lg,
            editable: true,
            context: {
              required: true,
              cell: {
                type: "text",
                addable: true,
              },
            },
          },
          {
            field: "menuName",
            headerName: translate(TRANSLATION_KEY.menu.label.MENU_NAME),
            minWidth: GRID_WIDTH.lg,
            flex: 1,
            editable: true,
            context: {
              required: true,
            },
          },
          {
            field: "menuType",
            headerName: translate(TRANSLATION_KEY.menu.label.MENU_TYPE),
            width: GRID_WIDTH.md,
            editable: true,
            context: {
              align: "center",
              required: true,
              cell: {
                type: "select",
                options: getOptions("MENU_TYPE"),
                addable: true,
              },
            },
          },
          {
            field: "url",
            headerName: translate(TRANSLATION_KEY.menu.label.URL),
            minWidth: GRID_WIDTH.lg,
            flex: 1,
            editable: true,
            context: {
              required: true,
              cell: {
                type: "text",
                addable: true,
              },
            },
          },
          {
            field: "parentMenuId",
            headerName: translate(TRANSLATION_KEY.menu.label.PARENT_MENU_ID),
            width: GRID_WIDTH.lg,
            editable: true,
            context: {
              cell: {
                type: "text",
                addable: true,
              },
            },
          },
          {
            field: "sortOrder",
            headerName: translate(TRANSLATION_KEY.common.label.SORT_ORDER),
            width: GRID_WIDTH.md,
            editable: true,
            context: {
              align: "center",
              required: true,
              cell: {
                type: "number",
              },
            },
          },
          {
            field: "iconName",
            headerName: translate(TRANSLATION_KEY.menu.label.ICON_NAME),
            headerComponent: MenuIconNameHeader,
            minWidth: GRID_WIDTH.lg,
            editable: true,
          },
          {
            field: "dataStatus",
            headerName: translate(TRANSLATION_KEY.common.label.DATA_STATUS),
            width: GRID_WIDTH.md,
            editable: true,
            context: {
              align: "center",
              required: true,
              cell: {
                type: "select",
                options: getOptions("DATA_STATUS"),
              },
            },
            valueFormatter: (params) => {
              return getOptionName("DATA_STATUS", params.value) ?? "";
            },
          },
          {
            field: "createdBy",
            headerName: translate(TRANSLATION_KEY.common.label.CREATED_BY),
            width: GRID_WIDTH.md,
          },
          {
            field: "createdAt",
            headerName: translate(TRANSLATION_KEY.common.label.CREATED_AT),
            context: {
              align: "center",
            },
            valueFormatter: (params) => {
              return params.value
                ? dayjs(params.value).format(DATE_TIME_FORMAT)
                : "";
            },
          },
          {
            field: "updatedBy",
            headerName: translate(TRANSLATION_KEY.common.label.UPDATED_BY),
            width: GRID_WIDTH.md,
          },
          {
            field: "updatedAt",
            headerName: translate(TRANSLATION_KEY.common.label.UPDATED_AT),
            context: {
              align: "center",
            },
            valueFormatter: (params) => {
              return params.value
                ? dayjs(params.value).format(DATE_TIME_FORMAT)
                : "";
            },
          },
        ]}
        onAdd={handleAddMenu}
        onDetail={handleDetailMenu}
        onSave={handleSaveMenus}
        pageInfo={pageInfo}
        onPaginationChange={onPaginationChange}
      />
      {openMenuDialog && (
        <MenuDialog
          open={openMenuDialog}
          menuValue={editMenuTarget}
          readonly={doesNotHaveWritePermission}
          onClose={handleCloseMenuDialog}
        />
      )}
    </Card>
  );
}

import { useState } from "react";

import type { CellClickedEvent } from "ag-grid-community";
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
import { Role } from "@/models/authority-model";
import { PageInfo } from "@/models/common-model";
import { RoleDialog } from "@/pages/setting/system/authority-management/_components/RoleDialog";
import { useRoleOperation } from "@/resources/authority/useRoleOperation";

interface RoleGridProps {
  rowData?: Role[];
  pageInfo?: PageInfo<Role>;
  onRoleSelected?: (role: Role) => void;
  onPaginationChange?: (page: number) => void;
}

export function RoleGrid({
  rowData = [],
  pageInfo,
  onRoleSelected,
  onPaginationChange,
}: RoleGridProps) {
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [editRoleTarget, setEditRoleTarget] = useState<string>();

  const { getCodeOptions: getOptions, getCodeName: getOptionName } =
    useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { hasPermission } = useAuthorization();
  const doesNotHaveWritePermission = !hasPermission(
    ROUTE.SETTING.SYSTEM_SETTING.AUTHORITY_MANAGEMENT.ID,
    PERMISSION.WRITE,
  );

  const { mutate: operateRoles } = useRoleOperation();

  const handleAddRole = () => {
    setOpenRoleDialog(true);
  };

  const handleSaveRoles = (
    { newRows, editedRows, deletedRows }: DataGridSavePayload<Role>,
    { onSuccess }: DataGridSaveCallbacks,
  ) => {
    operateRoles(
      {
        roleSaves: newRows.map((row) => ({
          roleCode: row.roleCode,
          roleName: row.roleName,
          sortOrder: row.sortOrder,
          dataStatus: row.dataStatus,
        })),
        roleUpdates: editedRows.map((row) => ({
          roleCode: row.roleCode,
          roleName: row.roleName,
          sortOrder: row.sortOrder,
          dataStatus: row.dataStatus,
        })),
        roleDeletes: deletedRows.map((row) => ({
          roleCode: row.roleCode,
        })),
      },
      { onSuccess },
    );
  };

  const handleDetailRole = (data: Role) => {
    setOpenRoleDialog(true);
    setEditRoleTarget(data.roleCode);
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
    setEditRoleTarget(undefined);
  };

  const handleCellClicked = (e: CellClickedEvent<Role>) => {
    if (e.data) {
      onRoleSelected?.(e.data);
    }
  };

  return (
    <Card>
      <DataGrid<Role>
        gridId="role-grid"
        childGridIds={["permission-grid"]}
        title={translate(TRANSLATION_KEY.authority.label.ROLE)}
        visibleRowCount={5}
        readonly={doesNotHaveWritePermission}
        rowData={rowData}
        columnDefs={[
          {
            field: "roleCode",
            headerName: translate(TRANSLATION_KEY.authority.label.ROLE_CODE),
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
            field: "roleName",
            headerName: translate(TRANSLATION_KEY.authority.label.ROLE_NAME),
            minWidth: GRID_WIDTH.lg,
            flex: 1,
            editable: true,
            context: {
              required: true,
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
        pageInfo={pageInfo}
        onPaginationChange={onPaginationChange}
        onCellClicked={handleCellClicked}
        onAdd={handleAddRole}
        onDetail={handleDetailRole}
        onSave={handleSaveRoles}
      />
      {openRoleDialog && (
        <RoleDialog
          open={openRoleDialog}
          roleValue={editRoleTarget}
          readonly={doesNotHaveWritePermission}
          onClose={handleCloseRoleDialog}
        />
      )}
    </Card>
  );
}

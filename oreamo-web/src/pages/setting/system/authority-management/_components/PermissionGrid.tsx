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
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useAuthorization } from "@/hooks/useAuthorization";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { Permission } from "@/models/authority-model";
import { PageInfo } from "@/models/common-model";
import { PermissionDialog } from "@/pages/setting/system/authority-management/_components/PermissionDialog";
import { usePermissionOperation } from "@/resources/authority/usePermissionOperation";

interface PermissionGridProps {
  rowData?: Permission[];
  pageInfo?: PageInfo<Permission>;
  onPaginationChange?: (page: number) => void;
}

export function PermissionGrid({
  rowData = [],
  pageInfo,
  onPaginationChange,
}: PermissionGridProps) {
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [editPermissionTarget, setEditPermissionTarget] = useState<string>();

  const { getCodeOptions: getOptions, getCodeName: getOptionName } =
    useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { hasPermission } = useAuthorization();
  const doesNotHaveWritePermission = !hasPermission(
    PERMISSION.AUTHORITY_MANAGEMENT_WRITE,
  );

  const { mutate: operatePermissions } = usePermissionOperation();

  const handleAddPermission = () => {
    setOpenPermissionDialog(true);
  };

  const handleSavePermissions = (
    { newRows, editedRows, deletedRows }: DataGridSavePayload<Permission>,
    { onSuccess }: DataGridSaveCallbacks,
  ) => {
    operatePermissions(
      {
        permissionSaves: newRows.map((row) => ({
          permissionCode: row.permissionCode,
          permissionName: row.permissionName,
          sortOrder: row.sortOrder,
          dataStatus: row.dataStatus,
        })),
        permissionUpdates: editedRows.map((row) => ({
          permissionCode: row.permissionCode,
          permissionName: row.permissionName,
          sortOrder: row.sortOrder,
          dataStatus: row.dataStatus,
        })),
        permissionDeletes: deletedRows.map((row) => ({
          permissionCode: row.permissionCode,
        })),
      },
      { onSuccess },
    );
  };

  const handleDetailPermission = (data: Permission) => {
    setOpenPermissionDialog(true);
    setEditPermissionTarget(data.permissionCode);
  };

  const handleClosePermissionDialog = () => {
    setOpenPermissionDialog(false);
    setEditPermissionTarget(undefined);
  };

  return (
    <Card>
      <DataGrid<Permission>
        gridId="permission-grid"
        title={translate(TRANSLATION_KEY.authority.label.PERMISSION)}
        readonly={doesNotHaveWritePermission}
        rowData={rowData}
        columnDefs={[
          {
            field: "permissionCode",
            headerName: translate(
              TRANSLATION_KEY.authority.label.PERMISSION_CODE,
            ),
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
            field: "permissionName",
            headerName: translate(
              TRANSLATION_KEY.authority.label.PERMISSION_NAME,
            ),
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
        onAdd={handleAddPermission}
        onDetail={handleDetailPermission}
        onSave={handleSavePermissions}
      />
      {openPermissionDialog && (
        <PermissionDialog
          open={openPermissionDialog}
          permissionValue={editPermissionTarget}
          readonly={doesNotHaveWritePermission}
          onClose={handleClosePermissionDialog}
        />
      )}
    </Card>
  );
}

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
import { User } from "@/models/user-model";
import { UserDialog } from "@/pages/setting/system/user-management/_components/UserDialog";
import { useRoleInfos } from "@/resources/authority/useRoleInfos";
import { useUserOperation } from "@/resources/user/useUserOperation";
import { useUserPasswordReset } from "@/resources/user/useUserPasswordReset";
import { useSystemConfirm } from "@/stores/system-dialog-store";
import { useSystemToast } from "@/stores/system-toast-store";

interface UserGridProps {
  rowData?: User[];
  pageInfo?: PageInfo<User>;
  onPaginationChange?: (page: number) => void;
}

export function UserGrid({
  rowData = [],
  pageInfo,
  onPaginationChange,
}: UserGridProps) {
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [detailUserTarget, setDetailUserTarget] = useState<string>();

  const confirm = useSystemConfirm();
  const toast = useSystemToast();

  const { getCodeOptions: getOptions } = useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { hasPermission } = useAuthorization();
  const doesNotHaveWritePermission = !hasPermission(
    ROUTE.SETTING.SYSTEM_SETTING.USER_MANAGEMENT.ID,
    PERMISSION.WRITE,
  );

  const { data: roleInfos = [] } = useRoleInfos();

  const { mutate: operateUsers } = useUserOperation();
  const { mutate: resetUserPassword } = useUserPasswordReset();

  const handleSaveUsers = (
    { newRows, editedRows, deletedRows }: DataGridSavePayload<User>,
    { onSuccess }: DataGridSaveCallbacks,
  ) => {
    operateUsers(
      {
        userSaves: newRows.map((row) => ({
          username: row.username,
          roleCode: row.roleCode,
          dataStatus: row.dataStatus,
        })),
        userUpdates: editedRows.map((row) => ({
          username: row.username,
          roleCode: row.roleCode,
          dataStatus: row.dataStatus,
        })),
        userDeletes: deletedRows.map((row) => ({
          username: row.username,
        })),
      },
      { onSuccess },
    );
  };

  const handleAddUser = () => {
    setOpenUserDialog(true);
  };

  const handleResetUserPassword = (data: User) => {
    const messageVariables = {
      updateTarget: TRANSLATION_KEY.user.label.PASSWORD,
      updateTargetValue: data.username,
    };

    confirm({
      content: translate(
        TRANSLATION_KEY.common.message.UPDATE_CONFIRM,
        messageVariables,
      ),
      onConfirm: () => {
        resetUserPassword(
          { username: data.username },
          {
            onSuccess: () => {
              toast({
                type: "success",
                message: translate(
                  TRANSLATION_KEY.common.message.UPDATE_SUCCESS,
                  messageVariables,
                ),
              });
            },
          },
        );
      },
    });
  };

  const handleDetailUser = (data: User) => {
    setOpenUserDialog(true);
    setDetailUserTarget(data.username);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setDetailUserTarget(undefined);
  };

  return (
    <Card>
      <DataGrid<User>
        title={translate(TRANSLATION_KEY.user.label.USER)}
        visibleRowCount={10}
        readonly={doesNotHaveWritePermission}
        rowData={rowData}
        columnDefs={[
          {
            field: "username",
            headerName: translate(TRANSLATION_KEY.user.label.USERNAME),
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
            colId: "passwordReset",
            headerName: translate(TRANSLATION_KEY.user.label.PASSWORD),
            width: GRID_WIDTH.lg,
            context: {
              align: "center",
              visible: ({ gridMode }) => gridMode === "edit",
              cell: {
                type: "button",
                label: translate(TRANSLATION_KEY.common.label.RESET),
                onClick: handleResetUserPassword,
                visible: ({ rowState }) => rowState !== "new",
              },
            },
          },
          {
            field: "roleCode",
            headerName: translate(TRANSLATION_KEY.authority.label.ROLE),
            minWidth: GRID_WIDTH.lg,
            flex: 1,
            editable: true,
            context: {
              required: true,
              cell: {
                type: "select",
                options: roleInfos.map((roleInfo) => ({
                  value: roleInfo.roleCode,
                  label: roleInfo.roleName,
                })),
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
        onAdd={handleAddUser}
        onDetail={handleDetailUser}
        onSave={handleSaveUsers}
        pageInfo={pageInfo}
        onPaginationChange={onPaginationChange}
      />
      {openUserDialog && (
        <UserDialog
          open={openUserDialog}
          userValue={detailUserTarget}
          readonly={doesNotHaveWritePermission}
          onClose={handleCloseUserDialog}
        />
      )}
    </Card>
  );
}

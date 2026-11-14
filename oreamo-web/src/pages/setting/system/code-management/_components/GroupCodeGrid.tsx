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
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useAuthorization } from "@/hooks/useAuthorization";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { useTranslate } from "@/hooks/useTranslate";
import { GroupCode } from "@/models/code-model";
import { PageInfo } from "@/models/common-model";
import { GroupCodeDialog } from "@/pages/setting/system/code-management/_components/GroupCodeDialog";
import { useGroupCodeOperation } from "@/resources/code/useGroupCodeOperation";

interface GroupCodeGridProps {
  rowData?: GroupCode[];
  pageInfo?: PageInfo<GroupCode>;
  onGroupCodeSelected?: (groupCode: GroupCode) => void;
  onPaginationChange?: (page: number) => void;
}

export function GroupCodeGrid({
  rowData = [],
  pageInfo,
  onGroupCodeSelected,
  onPaginationChange,
}: GroupCodeGridProps) {
  const [openGroupCodeDialog, setOpenGroupCodeDialog] = useState(false);
  const [editGroupCodeTarget, setEditGroupCodeTarget] = useState<string>();

  const { getCodeOptions: getOptions, getCodeName: getOptionName } =
    useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { hasPermission } = useAuthorization();
  const doesNotHaveWritePermission = !hasPermission(
    PERMISSION.CODE_MANAGEMENT_WRITE,
  );

  const { mutate: operateGroupCodes } = useGroupCodeOperation();

  const handleAddGroupCode = () => {
    setOpenGroupCodeDialog(true);
  };

  const handleSaveGroupCodes = (
    { newRows, editedRows, deletedRows }: DataGridSavePayload<GroupCode>,
    { onSuccess }: DataGridSaveCallbacks,
  ) => {
    operateGroupCodes(
      {
        groupCodeSaves: newRows.map((row) => ({
          groupCode: row.groupCode,
          groupCodeName: row.groupCodeName,
          groupCodeDescription: row.groupCodeDescription,
          dataStatus: row.dataStatus,
          sortOrder: row.sortOrder,
        })),
        groupCodeUpdates: editedRows.map((row) => ({
          groupCode: row.groupCode,
          groupCodeName: row.groupCodeName,
          groupCodeDescription: row.groupCodeDescription,
          dataStatus: row.dataStatus,
        })),
        groupCodeDeletes: deletedRows.map((row) => ({
          groupCode: row.groupCode,
        })),
      },
      { onSuccess },
    );
  };

  const handleDetailGroupCode = (data: GroupCode) => {
    setOpenGroupCodeDialog(true);
    setEditGroupCodeTarget(data.groupCode);
  };

  const handleCloseGroupCodeDialog = () => {
    setOpenGroupCodeDialog(false);
    setEditGroupCodeTarget(undefined);
  };

  const handleCellClicked = (e: CellClickedEvent<GroupCode>) => {
    if (e.data) {
      onGroupCodeSelected?.(e.data);
    }
  };

  return (
    <Card>
      <DataGrid<GroupCode>
        gridId="group-code-grid"
        childGridIds={["common-code-grid"]}
        title={translate(TRANSLATION_KEY.code.label.GROUP_CODE)}
        visibleRowCount={5}
        readonly={doesNotHaveWritePermission}
        rowData={rowData}
        pageInfo={pageInfo}
        onPaginationChange={onPaginationChange}
        columnDefs={[
          {
            field: "groupCode",
            headerName: translate(TRANSLATION_KEY.code.label.GROUP_CODE),
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
            field: "groupCodeName",
            headerName: translate(TRANSLATION_KEY.code.label.GROUP_CODE_NAME),
            width: GRID_WIDTH.lg,
            editable: true,
            context: {
              required: true,
            },
          },
          {
            field: "groupCodeDescription",
            headerName: translate(TRANSLATION_KEY.common.label.DESCRIPTION),
            flex: 1,
            minWidth: GRID_WIDTH.xl,
            editable: true,
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
                addable: true,
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
        onAdd={handleAddGroupCode}
        onCellClicked={handleCellClicked}
        onDetail={handleDetailGroupCode}
        onSave={handleSaveGroupCodes}
      />
      {openGroupCodeDialog && (
        <GroupCodeDialog
          open={openGroupCodeDialog}
          groupCodeValue={editGroupCodeTarget}
          readonly={doesNotHaveWritePermission}
          onClose={handleCloseGroupCodeDialog}
        />
      )}
    </Card>
  );
}

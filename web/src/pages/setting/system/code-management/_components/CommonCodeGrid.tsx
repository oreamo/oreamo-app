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
import { CommonCode } from "@/models/code-model";
import { PageInfo } from "@/models/common-model";
import { CommonCodeDialog } from "@/pages/setting/system/code-management/_components/CommonCodeDialog";
import { useCommonCodeOperation } from "@/resources/code/useCommonCodeOperation";

interface CommonCodeGridProps {
  groupCode: string;
  rowData?: CommonCode[];
  pageInfo?: PageInfo<CommonCode>;
  onPaginationChange?: (page: number) => void;
}

export function CommonCodeGrid({
  groupCode,
  rowData = [],
  pageInfo,
  onPaginationChange,
}: CommonCodeGridProps) {
  const [openCommonCodeDialog, setOpenCommonCodeDialog] = useState(false);
  const [editCommonCodeTarget, setEditCommonCodeTarget] = useState<string>();

  const { getCodeOptions: getOptions, getCodeName: getOptionName } =
    useCodeOptions(["DATA_STATUS"]);
  const { translate } = useTranslate();

  const { hasPermission } = useAuthorization();
  const doesNotHaveWritePermission = !hasPermission(
    ROUTE.SETTING.SYSTEM_SETTING.CODE_MANAGEMENT.ID,
    PERMISSION.WRITE,
  );

  const { mutate: operateCommonCodes } = useCommonCodeOperation();

  const handleAddCommonCode = () => {
    setOpenCommonCodeDialog(true);
  };

  const handleSaveCommonCodes = (
    { newRows, editedRows, deletedRows }: DataGridSavePayload<CommonCode>,
    { onSuccess }: DataGridSaveCallbacks,
  ) => {
    operateCommonCodes(
      {
        commonCodeSaves: newRows.map((row) => ({
          groupCode: row.groupCode,
          commonCode: row.commonCode,
          commonCodeName: row.commonCodeName,
          commonCodeDescription: row.commonCodeDescription,
          dataStatus: row.dataStatus,
          sortOrder: row.sortOrder,
        })),
        commonCodeUpdates: editedRows.map((row) => ({
          groupCode: row.groupCode,
          commonCode: row.commonCode,
          commonCodeName: row.commonCodeName,
          commonCodeDescription: row.commonCodeDescription,
          dataStatus: row.dataStatus,
        })),
        commonCodeDeletes: deletedRows.map((row) => ({
          groupCode: row.groupCode,
          commonCode: row.commonCode,
        })),
      },
      { onSuccess },
    );
  };

  const handleDetailCommonCode = (data: CommonCode) => {
    setOpenCommonCodeDialog(true);
    setEditCommonCodeTarget(data.commonCode);
  };

  const handleCloseCommonCodeDialog = () => {
    setOpenCommonCodeDialog(false);
    setEditCommonCodeTarget(undefined);
  };

  return (
    <Card>
      <DataGrid<CommonCode>
        gridId="common-code-grid"
        title={translate(TRANSLATION_KEY.code.label.COMMON_CODE)}
        visibleRowCount={5}
        readonly={doesNotHaveWritePermission}
        rowData={rowData}
        columnDefs={[
          {
            field: "groupCode",
            headerName: translate(TRANSLATION_KEY.code.label.GROUP_CODE),
            width: GRID_WIDTH.lg,
            context: {
              required: true,
            },
          },
          {
            field: "commonCode",
            headerName: translate(TRANSLATION_KEY.code.label.COMMON_CODE),
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
            field: "commonCodeName",
            headerName: translate(TRANSLATION_KEY.code.label.COMMON_CODE_NAME),
            width: GRID_WIDTH.xl,
            editable: true,
            context: {
              required: true,
            },
          },
          {
            field: "commonCodeDescription",
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
        rowDefaultValue={{ groupCode }}
        onAdd={handleAddCommonCode}
        onDetail={handleDetailCommonCode}
        onSave={handleSaveCommonCodes}
        pageInfo={pageInfo}
        onPaginationChange={onPaginationChange}
      />
      {openCommonCodeDialog && (
        <CommonCodeDialog
          open={openCommonCodeDialog}
          groupCode={groupCode}
          commonCodeValue={editCommonCodeTarget}
          readonly={doesNotHaveWritePermission}
          onClose={handleCloseCommonCodeDialog}
        />
      )}
    </Card>
  );
}

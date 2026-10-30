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
import { PageInfo } from "@/models/common-model";
import { Translation } from "@/models/translation-model";
import { TranslationDialog } from "@/pages/admin/translation-management/_components/TranslationDialog";
import { useTranslationOperation } from "@/resources/translation/useTranslationOperation";

interface TranslationGridProps {
  rowData?: Translation[];
  pageInfo?: PageInfo<Translation>;
  onPaginationChange?: (page: number) => void;
}

export function TranslationGrid({
  rowData = [],
  pageInfo,
  onPaginationChange,
}: TranslationGridProps) {
  const [openTranslationDialog, setOpenTranslationDialog] = useState(false);
  const [editTranslationTarget, setEditTranslationTarget] =
    useState<Translation>();

  const { getCodeOptions: getOptions, getCodeName: getOptionName } =
    useCodeOptions([
      "DATA_STATUS",
      "TRANSLATION_GROUP",
      "TRANSLATION_TYPE",
      "TRANSLATION_LOCALE",
    ]);
  const { translate } = useTranslate();

  const { hasPermission } = useAuthorization();
  const doesNotHaveWritePermission = !hasPermission(
    PERMISSION.TRANSLATION_MANAGEMENT_WRITE,
  );

  const { mutate: operateTranslations } = useTranslationOperation();

  const handleAddTranslation = () => {
    setOpenTranslationDialog(true);
  };

  const handleSaveTranslations = (
    { newRows, editedRows, deletedRows }: DataGridSavePayload<Translation>,
    { onSuccess }: DataGridSaveCallbacks,
  ) => {
    operateTranslations(
      {
        translationSaves: newRows.map((row) => ({
          translationGroup: row.translationGroup,
          translationType: row.translationType,
          translationCode: row.translationCode,
          translationLocale: row.translationLocale,
          translationContent: row.translationContent,
          dataStatus: row.dataStatus,
        })),
        translationUpdates: editedRows.map((row) => ({
          translationGroup: row.translationGroup,
          translationType: row.translationType,
          translationCode: row.translationCode,
          translationLocale: row.translationLocale,
          translationContent: row.translationContent,
          dataStatus: row.dataStatus,
        })),
        translationDeletes: deletedRows.map((row) => ({
          translationGroup: row.translationGroup,
          translationType: row.translationType,
          translationCode: row.translationCode,
          translationLocale: row.translationLocale,
        })),
      },
      { onSuccess },
    );
  };

  const handleDetailTranslation = (data: Translation) => {
    setOpenTranslationDialog(true);
    setEditTranslationTarget(data);
  };

  const handleCloseTranslationDialog = () => {
    setOpenTranslationDialog(false);
    setEditTranslationTarget(undefined);
  };

  return (
    <Card>
      <DataGrid<Translation>
        title={translate(TRANSLATION_KEY.translation.label.TRANSLATION)}
        readonly={doesNotHaveWritePermission}
        rowData={rowData}
        columnDefs={[
          {
            field: "translationGroup",
            headerName: translate(
              TRANSLATION_KEY.translation.label.TRANSLATION_GROUP,
            ),
            width: GRID_WIDTH.lg,
            editable: true,
            context: {
              align: "center",
              required: true,
              cell: {
                type: "select",
                options: getOptions("TRANSLATION_GROUP"),
                addable: true,
              },
            },
          },
          {
            field: "translationType",
            headerName: translate(
              TRANSLATION_KEY.translation.label.TRANSLATION_TYPE,
            ),
            width: GRID_WIDTH.lg,
            editable: true,
            context: {
              align: "center",
              required: true,
              cell: {
                type: "select",
                options: getOptions("TRANSLATION_TYPE"),
                addable: true,
              },
            },
          },
          {
            field: "translationCode",
            headerName: translate(
              TRANSLATION_KEY.translation.label.TRANSLATION_CODE,
            ),
            width: GRID_WIDTH.xl,
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
            field: "translationLocale",
            headerName: translate(
              TRANSLATION_KEY.translation.label.TRANSLATION_LOCALE,
            ),
            width: GRID_WIDTH.lg,
            editable: true,
            context: {
              align: "center",
              required: true,
              cell: {
                type: "select",
                options: getOptions("TRANSLATION_LOCALE"),
                addable: true,
              },
            },
          },
          {
            field: "translationContent",
            headerName: translate(
              TRANSLATION_KEY.translation.label.TRANSLATION_CONTENT,
            ),
            flex: 1,
            minWidth: GRID_WIDTH.xl,
            editable: true,
            context: {
              required: true,
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
        onAdd={handleAddTranslation}
        onDetail={handleDetailTranslation}
        onSave={handleSaveTranslations}
        pageInfo={pageInfo}
        onPaginationChange={onPaginationChange}
      />
      {openTranslationDialog && (
        <TranslationDialog
          open={openTranslationDialog}
          translationGroup={editTranslationTarget?.translationGroup}
          translationType={editTranslationTarget?.translationType}
          translationCode={editTranslationTarget?.translationCode}
          translationLocale={editTranslationTarget?.translationLocale}
          readonly={doesNotHaveWritePermission}
          onClose={handleCloseTranslationDialog}
        />
      )}
    </Card>
  );
}

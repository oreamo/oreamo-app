import { styled } from "@mui/material";

import { Button } from "@/components/common/button/Button";
import {
  IconButton,
  IconButtonProps,
} from "@/components/common/button/IconButton";
import { Toggle } from "@/components/common/button/Toggle";
import { Icon } from "@/components/common/display/Icon";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import type {
  DataGridSaveCallbacks,
  DataGridSavePayload,
} from "@/components/data-grid/DataGrid";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { PageInfo } from "@/models/common-model";
import { useSystemConfirm } from "@/stores/system-dialog-store";
import { useSystemToast } from "@/stores/system-toast-store";
import { GridMode } from "@/types/ag-grid";

export interface DataGridToolbarProps<R> {
  title?: string;
  mode: GridMode;
  pageInfo?: PageInfo<R>;
  readonly?: boolean;
  hasPendingChanges: () => boolean;
  discardChanges: () => void;
  getChanges: () => DataGridSavePayload<R>;
  resetChanges: () => void;
  onAdd?: () => void;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onDeleteRow: () => void;
  onRestoreRow: () => void;
  onModeChange: (mode: GridMode) => void;
  onSave?: (
    payload: DataGridSavePayload<R>,
    callbacks: DataGridSaveCallbacks,
  ) => void;
}

export function DataGridToolbar<R>({
  title,
  mode,
  pageInfo,
  readonly = false,
  hasPendingChanges,
  discardChanges,
  getChanges,
  resetChanges,
  onAdd,
  onAddRow,
  onRemoveRow,
  onDeleteRow,
  onRestoreRow,
  onModeChange,
  onSave,
}: DataGridToolbarProps<R>) {
  const { translate } = useTranslate();
  const confirm = useSystemConfirm();
  const toast = useSystemToast();

  const handleModeChange = (value?: string) => {
    if (!value) return;

    const nextMode = value as GridMode;

    const isEditToReadChange = mode === "edit" && nextMode === "read";

    if (isEditToReadChange && hasPendingChanges()) {
      confirm({
        content: translate(
          TRANSLATION_KEY.common.message.DISCARD_CHANGES_CONFIRM,
        ),
        onConfirm: () => {
          discardChanges();
          onModeChange(nextMode);
        },
      });
      return;
    }

    onModeChange(nextMode);
  };

  const handleSave = () => {
    if (!onSave) return;

    const changes = getChanges();

    confirm({
      content: translate(TRANSLATION_KEY.common.message.OPERATE_CONFIRM),
      onConfirm: () => {
        onSave(changes, {
          onSuccess: () => {
            resetChanges();
            onModeChange("read");
            toast({
              type: "info",
              message: translate(
                TRANSLATION_KEY.common.message.OPERATE_SUCCESS,
              ),
            });
          },
        });
      },
    });
  };

  const actionButtonCommonProps: Omit<IconButtonProps, "iconName"> = {
    variant: "outlined",
    size: "small",
  };

  return (
    <StyledDataGridToolbarContainer
      gap={1}
      align="center"
      justify="between"
      wrap
    >
      <Flex gap={1} align="center">
        {title && (
          <Text size="lg" weight="medium">
            {title}
          </Text>
        )}
        {pageInfo && (
          <StyledTotalCount align="center" justify="center">
            <Text size="sm" weight="medium" color="inherit">
              {pageInfo.total.toLocaleString()}
            </Text>
          </StyledTotalCount>
        )}
      </Flex>
      <StyledActionContainer gap={1} align="center" justify="end" wrap>
        <Flex gap={1} align="center">
          {mode === "read" && onAdd && !readonly && (
            <IconButton
              iconName="PostAdd"
              tooltip={{
                message: translate(TRANSLATION_KEY.common.label.NEW),
                placement: "top",
              }}
              {...actionButtonCommonProps}
              onClick={onAdd}
            />
          )}
          {mode === "edit" && (
            <>
              <IconButton
                iconName="Add"
                tooltip={{
                  message: `${translate(TRANSLATION_KEY.common.label.ADD)} ${translate(TRANSLATION_KEY.common.label.ROW)}`,
                  placement: "top",
                }}
                {...actionButtonCommonProps}
                onClick={onAddRow}
              />
              <IconButton
                iconName="Remove"
                tooltip={{
                  message: `${translate(TRANSLATION_KEY.common.label.REMOVE)} ${translate(TRANSLATION_KEY.common.label.ROW)}`,
                  placement: "top",
                }}
                {...actionButtonCommonProps}
                onClick={onRemoveRow}
              />
              <IconButton
                iconName="Delete"
                tooltip={{
                  message: `${translate(TRANSLATION_KEY.common.label.DELETE)} ${translate(TRANSLATION_KEY.common.label.ROW)}`,
                  placement: "top",
                }}
                {...actionButtonCommonProps}
                onClick={onDeleteRow}
              />
              <IconButton
                iconName="SettingsBackupRestore"
                tooltip={{
                  message: `${translate(TRANSLATION_KEY.common.label.RESTORE)} ${translate(TRANSLATION_KEY.common.label.ROW)}`,
                  placement: "top",
                }}
                {...actionButtonCommonProps}
                onClick={onRestoreRow}
              />
            </>
          )}
        </Flex>
        <Flex gap={1} align="center">
          {mode === "edit" && (
            <Button variant="contained" size="small" onClick={handleSave}>
              {translate(TRANSLATION_KEY.common.label.SAVE)}
            </Button>
          )}
          {!readonly && (
            <Toggle
              value={mode}
              options={[
                {
                  value: "read",
                  label: <Icon iconName="TableRows" size="small" />,
                },
                {
                  value: "edit",
                  label: <Icon iconName="Edit" size="small" />,
                },
              ]}
              size="small"
              onChange={handleModeChange}
            />
          )}
        </Flex>
      </StyledActionContainer>
    </StyledDataGridToolbarContainer>
  );
}

const StyledDataGridToolbarContainer = styled(Flex)(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(0.5)}`,

  backgroundColor: theme.palette.surface.raised,
}));

const StyledTotalCount = styled(Flex)(({ theme }) => ({
  minWidth: 28,
  height: 22,

  padding: `0 ${theme.spacing(1)}`,

  borderRadius: theme.shape.borderRadiusScale.full,

  backgroundColor: theme.palette.scale[200],
  color: theme.palette.scale[800],
}));

const StyledActionContainer = styled(Flex)({
  marginLeft: "auto",
});

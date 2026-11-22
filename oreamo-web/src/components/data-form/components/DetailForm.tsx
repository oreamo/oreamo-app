import { ReactNode } from "react";

import { styled } from "@mui/material";
import { FieldValues, UseFormReturn } from "react-hook-form";

import { Flex } from "@/components/common/layout/Flex";
import { Grid } from "@/components/common/layout/Grid";
import { DataForm } from "@/components/data-form/DataForm";

export interface DetailFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  children?: ReactNode;
  onEnter?: () => void;
}

export function DetailForm<TFieldValues extends FieldValues>({
  form,
  children,
  onEnter,
}: DetailFormProps<TFieldValues>) {
  return (
    <DataForm form={form} onEnter={onEnter}>
      <StyledDetailFormContainer template="240px 1fr">
        {children}
      </StyledDetailFormContainer>
    </DataForm>
  );
}

interface DetailFormItemProps {
  title?: ReactNode;
  required?: boolean;
  children?: ReactNode;
}

function DetailFormItem({
  title,
  required = false,
  children,
}: DetailFormItemProps) {
  return (
    <>
      <StyledLabelContainer align="center" justify="end">
        {title}
        {required && <StyledRequiredMark>*</StyledRequiredMark>}
      </StyledLabelContainer>
      <StyledValueContainer align="center">{children}</StyledValueContainer>
    </>
  );
}

const StyledDetailFormContainer = styled(Grid)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.scale[200]}`,
  borderBottom: `1px solid ${theme.palette.scale[200]}`,
  borderLeft: `1px solid ${theme.palette.scale[200]}`,
  borderRadius: theme.shape.borderRadiusScale.md,
  overflow: "hidden",
}));

const StyledLabelContainer = styled(Flex)(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

  borderTop: `1px solid ${theme.palette.scale[200]}`,

  backgroundColor: theme.palette.scale[100],
  color: theme.palette.scale[600],
  fontSize: "14px",
}));

const StyledRequiredMark = styled("span")(({ theme }) => ({
  marginLeft: theme.spacing(0.5),

  color: theme.palette.semantic.error,
}));

const StyledValueContainer = styled(Flex)(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

  borderTop: `1px solid ${theme.palette.scale[200]}`,
  borderLeft: `1px solid ${theme.palette.scale[200]}`,

  color: theme.palette.scale[800],
  fontSize: "14px",

  "& > .MuiFormControl-root, & > .MuiTextField-root": {
    width: "100%",
  },
}));

DetailForm.Item = DetailFormItem;

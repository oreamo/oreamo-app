import { KeyboardEvent, ReactNode } from "react";

import { styled } from "@mui/material";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

import { Flex } from "@/components/common/layout/Flex";
import { Grid } from "@/components/common/layout/Grid";

export interface DataFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  children?: ReactNode;
  onEnter?: () => void;
}

interface DataFormRowProps {
  children: ReactNode;
}

interface DataFormColumnProps {
  span?: boolean;
  action?: boolean;
  direction?: "row" | "column";
  children: ReactNode;
}

export function DataForm<TFieldValues extends FieldValues>({
  form,
  children,
  onEnter,
}: DataFormProps<TFieldValues>) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter?.();
    }
  };

  return (
    <FormProvider {...form}>
      <StyledDataFormContainer onKeyDown={handleKeyDown}>
        {children}
      </StyledDataFormContainer>
    </FormProvider>
  );
}

function DataFormRow({ children }: DataFormRowProps) {
  return <StyledDataFormWrapper gap={3}>{children}</StyledDataFormWrapper>;
}

function DataFormColumn({
  span = false,
  action = false,
  direction,
  children,
}: DataFormColumnProps) {
  return (
    <StyledDataFormGroup
      direction={direction}
      gap={2}
      span={span}
      action={action}
    >
      {children}
    </StyledDataFormGroup>
  );
}

DataForm.Row = DataFormRow;
DataForm.Column = DataFormColumn;

const StyledDataFormContainer = styled("form")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(3),
}));

const StyledDataFormWrapper = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up("tablet")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },

  [theme.breakpoints.up("desktop")]: {
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: theme.spacing(4),
  },
}));

const StyledDataFormGroup = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "span" && prop !== "action",
})<{ span: boolean; action: boolean }>(({ span, action }) => ({
  minWidth: 0,

  ...(action && { justifySelf: "end", gridColumn: "-2 / -1" }),
  ...(span && { gridColumn: "1 / -1" }),
}));

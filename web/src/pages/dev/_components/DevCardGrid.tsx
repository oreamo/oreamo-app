import { ReactNode } from "react";

import { Grid } from "@/components/common/layout/Grid";

export interface DevCardGridProps {
  children: ReactNode;
}

export function DevCardGrid({ children }: DevCardGridProps) {
  return (
    <Grid columns={{ desktop: 3, tablet: 2, phone: 1 }} gap={4}>
      {children}
    </Grid>
  );
}

import { IHeaderParams } from "ag-grid-community";

import { MenuIconGuideButton } from "@/pages/setting/system/menu-management/_components/MenuIconGuideButton";

export function MenuIconNameHeader({ displayName }: IHeaderParams) {
  return (
    <div className="ag-header-cell-label">
      <span className="ag-header-cell-text">{displayName}</span>
      <MenuIconGuideButton />
    </div>
  );
}

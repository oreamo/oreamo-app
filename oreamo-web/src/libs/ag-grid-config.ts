import {
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  CustomEditorModule,
  DateEditorModule,
  ModuleRegistry,
  NumberEditorModule,
  RowApiModule,
  RowSelectionModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  CellStyleModule,
  RowApiModule,
  RowSelectionModule,
  TextEditorModule,
  CustomEditorModule,
  DateEditorModule,
  NumberEditorModule,
  ValidationModule,
]);

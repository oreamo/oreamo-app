import { useState } from "react";

import {
  SearchInputDialogProps,
  SearchInputValue,
} from "@/components/common/input/SearchInput";
import { SearchModal } from "@/components/common/overlay/SearchModal";
import { SearchForm } from "@/components/data-form/components/SearchForm";
import { TextInputField } from "@/components/data-form/components/TextInputField";
import { useDataForm } from "@/components/data-form/hooks/useDataForm";
import { DataGrid } from "@/components/data-grid/DataGrid";

const PAGE_SIZE = 10;

const SEARCH_DIALOG_ROWS: SearchInputValue[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "jackfruit", label: "Jackfruit" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
  { value: "mango", label: "Mango" },
  { value: "nectarine", label: "Nectarine" },
  { value: "orange", label: "Orange" },
  { value: "papaya", label: "Papaya" },
  { value: "quince", label: "Quince" },
  { value: "raspberry", label: "Raspberry" },
  { value: "strawberry", label: "Strawberry" },
  { value: "tangerine", label: "Tangerine" },
  { value: "watermelon", label: "Watermelon" },
];

interface SearchFormValues {
  keyword: string;
}

export type DevSearchSelectDialogProps = Partial<SearchInputDialogProps>;

export function DevSearchSelectDialog({
  value,
  onConfirm = () => {},
  onCancel = () => {},
}: DevSearchSelectDialogProps) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(value);

  const { form, handleSubmit, handleEnter } = useDataForm<SearchFormValues>({
    defaultValues: { keyword: "" },
    onValid: (data) => {
      setKeyword(data.keyword);
      setPage(1);
    },
  });

  const filteredOptions = SEARCH_DIALOG_ROWS.filter((option) =>
    (option.label ?? option.value)
      .toLowerCase()
      .includes(keyword.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filteredOptions.length / PAGE_SIZE));
  const pagedOptions = filteredOptions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleConfirm = () => {
    onConfirm(selectedRow);
  };

  const handleSelectedRowChange = (rows: SearchInputValue[]) => {
    setSelectedRow(rows[0]);
  };

  return (
    <SearchModal
      title="Search Option"
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <SearchForm form={form} onSearch={handleSubmit} onEnter={handleEnter}>
        <SearchForm.Item>
          <TextInputField<SearchFormValues, "keyword">
            name="keyword"
            label="Keyword"
          />
        </SearchForm.Item>
      </SearchForm>
      <DataGrid<SearchInputValue>
        visibleRowCount={10}
        readonly
        selectionMode="single"
        getRowId={(params) => params.data.value}
        rowData={pagedOptions}
        columnDefs={[
          { field: "value", headerName: "Value", width: 120 },
          { field: "label", headerName: "Name", flex: 1 },
        ]}
        pageInfo={{
          pageNum: page,
          pageSize: PAGE_SIZE,
          pages,
          total: filteredOptions.length,
          list: pagedOptions,
        }}
        selectedRows={selectedRow ? [selectedRow] : []}
        enableSelectByClick
        onPaginationChange={setPage}
        onSelectedRowChange={handleSelectedRowChange}
      />
    </SearchModal>
  );
}

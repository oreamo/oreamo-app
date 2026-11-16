import { MenuItem, MenuList } from "@mui/material";

import { SelectInputOption } from "@/components/common/input/SelectInput";

interface SelectOptionListProps {
  options: SelectInputOption[];
  selectedValues: SelectInputOption["value"][];
  onSelect: (value: SelectInputOption["value"]) => void;
}

export function SelectOptionList({
  options,
  selectedValues,
  onSelect,
}: SelectOptionListProps) {
  const handleSelect = (value: SelectInputOption["value"]) => {
    onSelect(value);
  };

  return (
    <MenuList>
      {options.map((option) => (
        <MenuItem
          key={option.value}
          selected={selectedValues.includes(option.value)}
          disabled={option.disabled}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </MenuItem>
      ))}
    </MenuList>
  );
}

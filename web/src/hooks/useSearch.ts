import { useState } from "react";

export function useSearch<TSearch extends {}>(defaultSearchValue: TSearch) {
  const [searchValue, setSearchValue] = useState<TSearch>(defaultSearchValue);

  const handleSearchValueChange = (changedSearchValue: Partial<TSearch>) => {
    setSearchValue((prevSearchValue) => ({
      ...prevSearchValue,
      ...changedSearchValue,
    }));
  };

  return {
    searchValue,
    defaultSearchValue,
    handleSearchValueChange,
  };
}

import { useState } from "react";

// Define the generic useSearch hook
export function useSearch<T extends { name: string }>(data: T[] | undefined) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  // Filter the data based on the search term
  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return { searchTerm, handleSearch, filteredData };
}

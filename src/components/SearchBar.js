import { useState } from "react";

export function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <input
        aria-labelledby="search-button"
        name="search"
        id="search"
        type="search"
        placeholder="Search Company"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          props.onChange(e.target.value);
        }}
        style={{ borderRadius: "10px", padding: "4px", paddingInline: "8px" }}
      />
    </div>
  );
}

export async function searchQueryFilter(dataRow, searchQuery) {
  let finalResults = dataRow.filter(
    (r) =>
      r.symbol.toLowerCase().indexOf(searchQuery) > -1 ||
      r.name.toLowerCase().indexOf(searchQuery) > -1 ||
      r.symbol.toUpperCase().indexOf(searchQuery) > -1 ||
      r.name.toUpperCase().indexOf(searchQuery) > -1
  );
  return finalResults;
}

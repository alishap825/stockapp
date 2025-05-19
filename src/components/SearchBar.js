export function SearchBar({ value, onChange }) {
  return (
    <div>
      <input
        aria-labelledby="search-button"
        name="search"
        id="search"
        type="search"
        placeholder="Search Company"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ borderRadius: "10px", padding: "4px", paddingInline: "8px" }}
      />
    </div>
  );
}

export async function searchQueryFilter(dataRow, searchQuery) {
  let finalResults = dataRow.filter(
    (r) =>
      r.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return finalResults;
}
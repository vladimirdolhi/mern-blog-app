const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search title, author or text..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: "100%",
      padding: 8,
      marginBottom: 10,
      border: "1px solid #ddd",
      borderRadius: 6,
    }}
  />
);

export default SearchBar;

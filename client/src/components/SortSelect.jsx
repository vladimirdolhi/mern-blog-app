const SortSelect = ({ value, onChange }) => (
  <div style={{ marginTop: 8, marginBottom: 12 }}>
    <label style={{ marginRight: 8 }}>Sort by:</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: 6 }}
    >
      <option value="date_desc">Newest first</option>
      <option value="date_asc">Oldest first</option>
      <option value="rating_desc">Rating: high → low</option>
      <option value="rating_asc">Rating: low → high</option>
    </select>
  </div>
);

export default SortSelect;

const DateFilter = ({ from, to, onFrom, onTo }) => (
  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
    <div style={{ flex: 1 }}>
      <label>From</label>
      <input
        type="date"
        value={from}
        onChange={(e) => onFrom(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />
    </div>
    <div style={{ flex: 1 }}>
      <label>To</label>
      <input
        type="date"
        value={to}
        onChange={(e) => onTo(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />
    </div>
  </div>
);

export default DateFilter;

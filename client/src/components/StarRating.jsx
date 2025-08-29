import React, { useState } from "react";

const StarRating = ({ value = 0, onChange, size = 22, readOnly = false }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const clickable = !!onChange && !readOnly;

  const getColor = (n) => {
    if (hoverValue) {
      return n <= hoverValue ? "#FFD700" : "#ccc"; // gold / grey
    }
    return n <= value ? "#FFD700" : "#ccc";
  };

  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {stars.map((n) => (
        <span
          key={n}
          role={clickable ? "button" : "img"}
          aria-label={n <= value ? "star filled" : "star"}
          onClick={clickable ? () => onChange(n) : undefined}
          onMouseEnter={clickable ? () => setHoverValue(n) : undefined}
          onMouseLeave={clickable ? () => setHoverValue(0) : undefined}
          style={{
            cursor: clickable ? "pointer" : "default",
            fontSize: size,
            lineHeight: 1,
            color: getColor(n),
            transition: "color 0.2s ease",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

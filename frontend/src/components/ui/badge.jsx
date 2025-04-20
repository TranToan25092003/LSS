import React from "react";

const Badge = ({ text }) => {
  return (
    <span style={{ padding: "5px 10px", borderRadius: "12px", backgroundColor: "#eee" }}>
      {text}
    </span>
  );
};

export { Badge };

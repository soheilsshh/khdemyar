import React from "react";

const ListSection = ({ title, items }) => (
  <div className="my-10">
    {title && <p>{title}</p>}
    <ul className="my-5 space-y-4">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
);

export default ListSection;

import React from "react";

function ButtonTypeOne({
  text,
  className,
  content,
  autosave = false,
  onClick = () => {},
  onChange = () => {},
  type = "",
  value = "",
}) {
  return (
    <button
      className={className}
      content={content}
      dir="rtl"
      onClick={onClick}
      onChange={onChange}
      type={type}
      value={value}
    >
      {text}
    </button>
  );
}

export default ButtonTypeOne;

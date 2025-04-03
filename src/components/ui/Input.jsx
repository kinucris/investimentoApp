// Input.jsx
import React from "react";
const Input = ({ placeholder, value, onChange, type = "text", className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`p-2 border rounded w-full focus:outline-none focus:ring focus:border-blue-300 ${className}`}
  />
);

export { Input };

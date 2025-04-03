// Input.jsx
import React from "react";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export { Input };

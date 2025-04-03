// Avatar.jsx
import React from "react";
const Avatar = ({ src, alt = "Avatar", className = "" }) => (
  <img
    src={src}
    alt={alt}
    className={`w-12 h-12 rounded-full border object-cover ${className}`}
  />
);

export { Avatar };

// Card.jsx
import React from "react";

const Card = ({ children, className = "" }) => (
  <div className={`p-4 border rounded-lg shadow bg-white ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="p-2">{children}</div>
);

export { Card, CardContent };

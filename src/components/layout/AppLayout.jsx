// AppLayout.jsx
import React from "react";
import Sidebar from "../ui/Sidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

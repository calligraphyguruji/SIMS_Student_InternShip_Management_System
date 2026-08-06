import React from "react";
import { Outlet } from "../../router.jsx";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 px-4 md:px-8 py-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

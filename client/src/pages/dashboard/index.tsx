// client/src/pages/dashboard/index.tsx
// (or whatever path/file is your Dashboard file — replace the file contents)
import React from "react";
import { useUser } from "@clerk/clerk-react";

import { FinancialList } from "./Financial-list";
import { FinancialForm } from "./Financial-record-form";
import Summary from "./Summary";


export const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="dashboard-container">
      <aside>
        <div className="panel">
          {/* Replace the three static summary cards with the dynamic Summary component */}
          <Summary />

          {/* If you still want to show the raw greeting from Dashboard (optional),
              you can uncomment the following block. But Summary already shows greeting. */}
          {/*
          <div className="summary-card">
            <div className="summary-title">Hello</div>
            <div className="summary-value">Welcome {user?.firstName ?? "there"} 👋</div>
          </div>
          */}
        </div>
      </aside>

      <main className="main-area">
        <div className="hero panel">
          <div>
            <h2>Overview</h2>
            <p>Quick actions, recent activity and an at-a-glance look at your finances.</p>
          </div>
        </div>

        <div className="panel fin-form">
          <FinancialForm />
        </div>

        <div className="panel fin-list">
          <FinancialList />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

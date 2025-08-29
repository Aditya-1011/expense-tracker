// client/src/App.tsx
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import DailyRecords from "./pages/dashboard/DailyRecords";
import MonthlySummary from "./pages/dashboard/MonthlySummary";
import { Auth } from "./pages/auth";
import { FinancialRecordProvider } from "./context/financial-record-context";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthListener from "./components/AuthListener";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <FinancialRecordProvider>
            {/* Global listener: will redirect to /auth when user signs out */}
            <AuthListener />
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/daily"
                element={
                  <ProtectedRoute>
                    <DailyRecords />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/monthly"
                element={
                  <ProtectedRoute>
                    <MonthlySummary />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </FinancialRecordProvider>
        </main>
      </div>
    </Router>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Notifications from "./pages/Notifications";
import PredictionDetails from "./pages/PredictionDetails";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/history"
        element={<History />}
      />

      <Route
        path="/history/:id"
        element={<PredictionDetails />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />

      <Route
        path="/notifications"
        element={<Notifications />}
      />

    </Routes>
  );
}
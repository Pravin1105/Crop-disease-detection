import { Routes, Route } from "./router";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import PredictionDetails from "./pages/PredictionDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
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

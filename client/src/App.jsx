import { BrowserRouter, Routes, Route } from "react-router-dom";
import AIChat from "./pages/AIChat";
import Reminders from "./pages/Reminders";
import Analytics from "./pages/Analytics";
import EmployeeProfile from "./pages/EmployeeProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import UploadTranscript from "./pages/UploadTranscript";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/employee/:id" element={<EmployeeProfile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/upload" element={<UploadTranscript />} />
        
        <Route path="/chat" element={<AIChat />} /> 
      </Routes>
    </BrowserRouter>
  );
}
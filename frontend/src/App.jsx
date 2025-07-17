import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Landing from "./pages/landing";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<Home />} />
    </Routes>
  );
}

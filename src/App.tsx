
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SearchServices from "./pages/SearchServices";
import BookingFlow from "./pages/BookingFlow";
import PatientManagement from "./pages/PatientManagement";
import BookingHistory from "./pages/BookingHistory";
import OrderHistory from "./pages/OrderHistory";
import AccountSettings from "./pages/AccountSettings";
import Support from "./pages/Support";
import BookingSuccess from "./pages/BookingSuccess";
import PublicCatalog from "./pages/PublicCatalog";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/search" element={<SearchServices />} />
      <Route path="/book/:serviceId" element={<BookingFlow />} />
      <Route path="/book/combo/:comboId" element={<BookingFlow />} />
      <Route path="/company/:companyId" element={<PublicCatalog />} />
      <Route path="/patients" element={<PatientManagement />} />
      <Route path="/patients/new" element={<PatientManagement />} />
      <Route path="/bookings" element={<BookingHistory />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/settings" element={<AccountSettings />} />
      <Route path="/support" element={<Support />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;

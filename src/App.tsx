import { Route, Routes, useLocation } from "react-router";
import AdminLayout from "./layouts/admin-layout";
import OverviewPage from "./pages/overview-page";
import MenuProvider from "./providers/menu-provider";
import ServicesPage from "./pages/services-page";
import ServicePage from "./pages/service-page";
import OffersPage from "./pages/offers-page";
import AdsPage from "./pages/ads-page";
import NotificationsPage from "./pages/notifications-page";
import CategoriesPage from "./pages/categories-page";
import AreasPage from "./pages/areas-page";
import UsersPage from "./pages/users-page";
import LoginPage from "./pages/login-page";
import ProtectedRoute from "./components/protected-route";

function App() {
  const location = useLocation();
  return (
    <Routes location={location}>
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <MenuProvider>
              <AdminLayout />
            </MenuProvider>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServicePage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/ads" element={<AdsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;

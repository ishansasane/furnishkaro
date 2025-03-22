import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar, { SidebarContext } from "./assets/compoonents/Sidebar";
import Dashboard from "./assets/pages/Dashboard";
import Projects from "./assets/pages/Projects";
import Customers from "./assets/pages/Customers";
import Masters from "./assets/pages/Masters";
import Tasks from "./assets/pages/Tasks";
import Reports from "./assets/pages/Reports";
import SettingsPage from "./assets/pages/SettingsPage";
import FormPage from "./assets/pages/FormPage";
import Store from "./assets/compoonents/Store.tsx";
import Items from "./assets/compoonents/Items.tsx";
import ProductGroup from "./assets/compoonents/ProductGroup.tsx";
import Brands from "./assets/compoonents/Brands.tsx";
import Catalogues from "./assets/compoonents/Catalogues.tsx";
import Interiors from "./assets/compoonents/Interiors.tsx";
import Tailors from "./assets/compoonents/Tailors.tsx";
import SalesAssociate from "./assets/compoonents/SalesAssociate.tsx";
import SaleSummery from "./assets/compoonents/SaleSummery.tsx";
import CustomerWise from "./assets/compoonents/CustomerWise.tsx";
import ProductGroupWise from "./assets/compoonents/ProductGroupWise.tsx";
import { useState } from "react";
import Login from "./assets/compoonents/Login.tsx";
import PassReset from "./assets/compoonents/ForgotPage.tsx";
import NewPass from "./assets/compoonents/NewPass.tsx";
import Register from "./assets/compoonents/Register.tsx";
import VerifyMail from "./assets/compoonents/VerifyMail.tsx";
import ProductFormPage from "./assets/pages/ProductFormPage.tsx";

function App() {
  const [expanded, setExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ expanded, toggleSidebar: () => setExpanded((prev) => !prev) }}>
      <Router>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className={`flex-1 overflow-y-auto h-screen p-6 transition-all ${expanded ? "ml-64" : "ml-20"}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgotpass" element={<PassReset />} />
              <Route path="/forgotpass/reset/:token" element={<NewPass />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<VerifyMail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/add-product" element={<ProductFormPage />} />
              <Route path="/masters" element={<Masters />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/add-project" element={<FormPage />} />
              
              {/* Masters Subroutes */}
              <Route path="/masters/stores" element={<Store />} />
              <Route path="/masters/items" element={<Items />} />
              <Route path="/masters/product-groups" element={<ProductGroup />} />
              <Route path="/masters/brands" element={<Brands />} />
              <Route path="/masters/catalogues" element={<Catalogues />} />
              <Route path="/masters/interiors" element={<Interiors />} />
              <Route path="/masters/tailors" element={<Tailors />} />
              <Route path="/masters/sales-associate" element={<SalesAssociate />} />

              {/* Uncomment if needed */}
              {/* <Route path="/table1" element={<SaleSummery />} />
              <Route path="/table2" element={<CustomerWise />} />
              <Route path="/table3" element={<ProductGroupWise />} /> */}

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </SidebarContext.Provider>
  );
}

export default App;

import { MoreVertical, ChevronLast, ChevronFirst, LayoutDashboard, Briefcase, Users, ClipboardList, ListChecks, FileText, Settings, ChevronDown } from "lucide-react";
import { createContext, useContext, ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarContextType {
  expanded: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export default function Sidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("Sidebar must be used within a SidebarContext.Provider");
  }

  const { expanded, toggleSidebar } = context;
  const [mastersOpen, setMastersOpen] = useState(false);

  return (
    <aside className={`h-screen bg-white border-r shadow-sm transition-all duration-300 ${expanded ? "w-64" : "w-20"} fixed`}>
      <nav className="h-full flex flex-col">
        {/* Logo & Toggle Button */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img src="https://img.logoipsum.com/243.svg" className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} alt="Logo" />
          <button onClick={toggleSidebar} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Sidebar Items */}
        <ul className="flex-1 px-3">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" path="/" />
          <SidebarItem icon={<Briefcase size={20} />} text="Projects" path="/projects" />
          <SidebarItem icon={<Users size={20} />} text="Customers" path="/customers" />
          <li className="relative">
            <button onClick={() => setMastersOpen(!mastersOpen)} className="flex items-center w-full py-2 px-3 my-1 font-medium rounded-md transition-all text-gray-600 hover:bg-gray-200">
              <ClipboardList size={20} />
              <span className={`flex justify-start overflow-hidden transition-all ${expanded ? "ml-3 w-40" : "w-0"}`}>Masters</span>
              <ChevronDown className={`ml-auto transform transition-transform ${mastersOpen ? "rotate-180" : "rotate-0"}`} />
            </button>
            {mastersOpen && (
              <ul className="ml-8 mt-1 space-y-1">
                <SidebarItem icon={null} text="Stores" path="/masters/stores" />
                <SidebarItem icon={null} text="Items" path="/masters/items" />
                <SidebarItem icon={null} text="Product Groups" path="/masters/product-groups" />
                <SidebarItem icon={null} text="Brands" path="/masters/brands" />
                <SidebarItem icon={null} text="Catalogues" path="/masters/catalogues" />
                <SidebarItem icon={null} text="Interiors" path="/masters/interiors" />
                <SidebarItem icon={null} text="Tailors" path="/masters/tailors" />
                <SidebarItem icon={null} text="Sales Associate" path="/masters/sales-associate" />
              </ul>
            )}
          </li>
          <SidebarItem icon={<ListChecks size={20} />} text="Tasks" path="/tasks" />
          <SidebarItem icon={<FileText size={20} />} text="Reports" path="/reports" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" path="/settings" />
        </ul>

        {/* User Info */}
        <div className="border-t flex items-center p-3">
          <img src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true" alt="User Avatar" className="w-10 h-10 rounded-md" />
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode | null;
  text: string;
  path: string;
}

export function SidebarItem({ icon, text, path }: SidebarItemProps) {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("SidebarItem must be used within a Sidebar");
  }
  const { expanded } = context;
  const location = useLocation();

  return (
    <Link to={path} className="block !no-underline hover:!no-underline">
      <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-all group
        ${location.pathname === path ? "bg-indigo-100 text-indigo-800" : "hover:bg-gray-200 text-gray-600"}`}>
        {icon && icon}
        <span className={`overflow-hidden transition-all ${expanded ? "ml-3 w-40" : "w-0"}`}>
          {expanded && text}
        </span>
      </li>
    </Link>
  );
}

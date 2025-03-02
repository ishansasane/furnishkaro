import { MoreVertical, ChevronLast, ChevronFirst, LayoutDashboard, Briefcase, Users, ClipboardList, ListChecks, FileText, Settings } from "lucide-react";
import { createContext, useContext, ReactNode } from "react";
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
          <SidebarItem icon={<ClipboardList size={20} />} text="Masters" path="/masters" />
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
  icon: ReactNode;
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
    <Link to={path} className="block">
      <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-all group
        ${location.pathname === path ? "bg-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}>
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? "ml-3 w-40" : "w-0"}`}>
          {expanded && text}
        </span>
      </li>
    </Link>
  );
}

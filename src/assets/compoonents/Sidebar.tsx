import {
  MoreVertical,
  ChevronLast,
  ChevronFirst,
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardList,
  ListChecks,
  FileText,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarContextType {
  expanded: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [mastersOpen, setMastersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setExpanded((prev) => !prev);

  // Auto-close mobile menu on window resize (above md breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  return (
    <>
      <SidebarContext.Provider value={{ expanded, toggleSidebar }}>
        {/* Desktop Sidebar */}
        <nav className="h-full flex-col hidden md:flex">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="https://img.logoipsum.com/243.svg"
              className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
              alt="Logo"
            />
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <SidebarContent mastersOpen={mastersOpen} setMastersOpen={setMastersOpen} setMobileMenuOpen={setMobileMenuOpen} />
        </nav>

        {/* Mobile Burger Menu */}
        <div className="md:hidden p-4 flex items-center justify-between bg-white shadow fixed w-full z-50">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <img src="https://img.logoipsum.com/243.svg" className="w-28" alt="Logo" />
        </div>

        {/* Mobile Sidebar Content */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full z-40 bg-white shadow-lg">
            <SidebarContext.Provider value={{ expanded: true, toggleSidebar: () => {} }}>
              <SidebarContent mastersOpen={mastersOpen} setMastersOpen={setMastersOpen} setMobileMenuOpen={setMobileMenuOpen} />
            </SidebarContext.Provider>
          </div>
        )}
      </SidebarContext.Provider>
    </>
  );
}

interface SidebarContentProps {
  mastersOpen: boolean;
  setMastersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SidebarContent({ mastersOpen, setMastersOpen, setMobileMenuOpen }: SidebarContentProps) {
  const context = useContext(SidebarContext);
  if (!context) return null;
  const { expanded } = context;

  return (
    <>
      <ul className="flex-1 px-3">
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" path="/" setMobileMenuOpen={setMobileMenuOpen} />
        <SidebarItem icon={<Briefcase size={20} />} text="Projects" path="/projects" setMobileMenuOpen={setMobileMenuOpen} />
        <SidebarItem icon={<Users size={20} />} text="Customers" path="/customers" setMobileMenuOpen={setMobileMenuOpen} />

        <li className="relative">
          <button
            onClick={() => setMastersOpen(!mastersOpen)}
            className="flex items-center w-full py-2 px-3 my-1 font-medium rounded-md transition-all text-gray-600 hover:bg-gray-200"
          >
            <ClipboardList size={20} />
            <span className={`flex justify-start overflow-hidden transition-all ${expanded ? "ml-3 w-40" : "w-0"}`}>Masters</span>
            <ChevronDown className={`ml-auto transform transition-transform ${mastersOpen ? "rotate-180" : "rotate-0"}`} />
          </button>
          {mastersOpen && (
            <ul className="ml-8 mt-1 space-y-1">
              {[
                ["Items", "/masters/items"],
                ["Product Groups", "/masters/product-groups"],
                ["Brands", "/masters/brands"],
                ["Catalogues", "/masters/catalogues"],
                ["Interiors", "/masters/interiors"],
                ["Tailors", "/masters/tailors"],
                ["Sales Associate", "/masters/sales-associate"],
                ["Stores", "/masters/stores"],
              ].map(([text, path]) => (
                <SidebarItem key={path} icon={null} text={text} path={path} setMobileMenuOpen={setMobileMenuOpen} />
              ))}
            </ul>
          )}
        </li>

        <SidebarItem icon={<ListChecks size={20} />} text="Tasks" path="/tasks" setMobileMenuOpen={setMobileMenuOpen} />
        <SidebarItem icon={<FileText size={20} />} text="Reports" path="/reports" setMobileMenuOpen={setMobileMenuOpen} />
        <SidebarItem icon={<Settings size={20} />} text="Settings" path="/settings" setMobileMenuOpen={setMobileMenuOpen} />
      </ul>

      <div className="border-t flex items-center p-3">
        <img
          src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
          alt="User Avatar"
          className="w-10 h-10 rounded-md"
        />
        <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
          <div className="leading-4">
            <h4 className="font-semibold">John Doe</h4>
            <span className="text-xs text-gray-600">johndoe@gmail.com</span>
          </div>
          <MoreVertical size={20} />
        </div>
      </div>
    </>
  );
}

interface SidebarItemProps {
  icon: ReactNode | null;
  text: string;
  path: string;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SidebarItem({ icon, text, path, setMobileMenuOpen }: SidebarItemProps) {
  const context = useContext(SidebarContext);
  if (!context) return null;
  const { expanded } = context;
  const location = useLocation();

  return (
    <Link
      to={path}
      onClick={() => {
        if (window.innerWidth < 768) {
          setMobileMenuOpen(false);
        }
      }}
      className="block !no-underline hover:!no-underline"
    >
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-all group
        ${location.pathname === path ? "bg-indigo-100 text-indigo-800" : "hover:bg-gray-200 text-gray-600"}`}
      >
        {icon && icon}
        <span className={`overflow-hidden transition-all ${expanded ? "ml-3 w-40" : "w-0"}`}>
          {expanded && text}
        </span>
      </li>
    </Link>
  );
}

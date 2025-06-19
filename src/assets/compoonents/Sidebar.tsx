// Sidebar.tsx
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
  Box,
  Layers,
  Tag,
  BookOpen,
  Home,
  Scissors,
  UserCircle,
  Store,
} from "lucide-react";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SidebarContextType {
  expanded: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export default function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const [mastersOpen, setMastersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setExpanded((prev) => {
      // Close masters when collapsing if they were open
      if (prev && !expanded && mastersOpen) {
        setMastersOpen(false);
      }
      return !prev;
    });
  };

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
    <SidebarContext.Provider value={{ expanded, toggleSidebar }}>
      {/* Desktop Sidebar */}
      <nav
        className={`h-full flex-col hidden md:flex transition-all duration-300 ease-in-out ${
          expanded ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <SidebarContent
          mastersOpen={mastersOpen}
          setMastersOpen={setMastersOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden p-4 flex items-center justify-between bg-white shadow fixed w-full z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-700"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <img
          src="https://img.logoipsum.com/243.svg"
          onClick={() => navigate("/")}
          className="w-28"
          alt="Logo"
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full z-40 bg-white shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <SidebarContext.Provider
          value={{ expanded: true, toggleSidebar: () => {} }}
        >
          <SidebarContent
            mastersOpen={mastersOpen}
            setMastersOpen={setMastersOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </SidebarContext.Provider>
      </div>
    </SidebarContext.Provider>
  );
}

// Sidebar Content
interface SidebarContentProps {
  mastersOpen: boolean;
  setMastersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SidebarContent({
  mastersOpen,
  setMastersOpen,
  setMobileMenuOpen,
}: SidebarContentProps) {
  const context = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { expanded } = context!;

  const user = {
    name: localStorage.getItem("auth_name") || "User",
    email: localStorage.getItem("auth_email") || "user@example.com",
  };

  // Master items with icons
  const masterItems = [
    { text: "Products", path: "/masters/items", icon: <Box size={18} /> },
    {
      text: "Product Groups",
      path: "/masters/product-groups",
      icon: <Layers size={18} />,
    },
    { text: "Brands", path: "/masters/brands", icon: <Tag size={18} /> },
    {
      text: "Catalogues",
      path: "/masters/catalogues",
      icon: <BookOpen size={18} />,
    },
    { text: "Interiors", path: "/masters/interiors", icon: <Home size={18} /> },
    { text: "Tailors", path: "/masters/tailors", icon: <Scissors size={18} /> },
    {
      text: "Sales Associate",
      path: "/masters/sales-associate",
      icon: <UserCircle size={18} />,
    },
    { text: "Stores", path: "/masters/stores", icon: <Store size={18} /> },
  ];

  return (
    <>
      <ul className="flex-1 px-3 pt-4 pb-2">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          path="/"
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <SidebarItem
          icon={<Briefcase size={20} />}
          text="Projects"
          path="/projects"
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <SidebarItem
          icon={<Users size={20} />}
          text="Customers"
          path="/customers"
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Dropdown Section */}
        <li className="relative">
          <button
            onClick={() => setMastersOpen(!mastersOpen)}
            className="flex items-center w-full py-2 px-3 my-1 font-medium rounded-md transition-all text-gray-600 hover:bg-gray-200"
          >
            <ClipboardList size={20} />
            <span
              className={`transition-all ${
                expanded ? "ml-3 w-10" : "w-0 overflow-hidden"
              }`}
            >
              Masters
            </span>
            {expanded && (
              <ChevronDown
                className={`ml-auto transform transition-transform duration-300 ${
                  mastersOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              mastersOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className={`${expanded ? "ml-8" : "ml-0"} mt-1 space-y-1`}>
              {masterItems.map(({ text, path, icon }) => (
                <SidebarItem
                  key={path}
                  icon={icon}
                  text={text}
                  path={path}
                  setMobileMenuOpen={setMobileMenuOpen}
                  isChildItem
                  showIconOnly={!expanded}
                />
              ))}
            </ul>
          </div>
        </li>

        <SidebarItem
          icon={<ListChecks size={20} />}
          text="Tasks"
          path="/tasks"
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <SidebarItem
          icon={<FileText size={20} />}
          text="Reports"
          path="/reports"
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          text="Settings"
          path="http://sheeladecor.free.nf/user-management.php"
          isExternal
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </ul>

      {/* User Profile Section */}
      <div className="relative border-t flex items-center p-3 cursor-pointer group">
        <img
          src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(
            user.name
          )}`}
          alt="User Avatar"
          className="w-10 h-10 rounded-md"
        />
        <div
          className={`flex justify-between items-center overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="leading-4">
            <h4 className="font-semibold">{user.name}</h4>
            <span className="text-xs text-gray-600">{user.email}</span>
          </div>
          <MoreVertical size={20} className="ml-2" />
        </div>

        {/* Dropdown Logout */}
        {dropdownOpen && expanded && (
          <div className="absolute bottom-14 right-4 bg-white shadow-lg rounded-md border w-40 z-50">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "https://sheeladecor.free.nf/logout.php";
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Sidebar Item
interface SidebarItemProps {
  icon: ReactNode | null;
  text: string;
  path: string;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isChildItem?: boolean;
  isExternal?: boolean;
  showIconOnly?: boolean;
}

function SidebarItem({
  icon,
  text,
  path,
  setMobileMenuOpen,
  isChildItem = false,
  isExternal = false,
  showIconOnly = false,
}: SidebarItemProps) {
  const context = useContext(SidebarContext);
  if (!context) return null;
  const { expanded } = context;
  const location = useLocation();

  const content = (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-all group
      ${
        location.pathname === path
          ? "bg-indigo-100 text-indigo-800"
          : "hover:bg-gray-200 text-gray-600"
      } ${isChildItem ? (expanded ? "pl-8" : "pl-3") : ""}`}
    >
      {icon && (
        <span className={isChildItem && expanded ? "mr-2" : ""}>{icon}</span>
      )}
      {(!showIconOnly || !isChildItem) && (
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "ml-3 w-40" : "w-0"
          }`}
        >
          {expanded && text}
        </span>
      )}
    </li>
  );

  return isExternal ? (
    <a
      href={path}
      target="_blank"
      rel="noopener noreferrer"
      className="block !no-underline hover:!no-underline"
      onClick={() => {
        if (window.innerWidth < 768) {
          setMobileMenuOpen(false);
        }
      }}
    >
      {content}
    </a>
  ) : (
    <Link
      to={path}
      className="block !no-underline hover:!no-underline"
      onClick={() => {
        if (window.innerWidth < 768) {
          setMobileMenuOpen(false);
        }
      }}
    >
      {content}
    </Link>
  );
}

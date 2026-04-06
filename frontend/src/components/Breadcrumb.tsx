import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbProps {
  isScrolled: boolean;
}

const Breadcrumb: FC<BreadcrumbProps> = ({ isScrolled }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "ABOUT US", href: "/about" },
    { label: "SERVICES", href: "/services" },
    { label: "INDUSTRIES", href: "/industries" },
    { label: "PUBLICATIONS", href: "/publications" },
    { label: "CAREER", href: "/careers" },
    { label: "CONTACT US", href: "/contact" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-3"
          : "bg-transparent text-white py-5"
      }`}
    >
      <nav className="max-w-[1400px] mx-auto pr-8">
        <div
          className={`flex items-center justify-between transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center -ml-16">
            <img
              src="/Africom_Logo.png"
              className="h-9 transition-all duration-300"
              alt="Africom"
            />
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.href}
                className={`text-xs font-semibold tracking-wider transition-colors ${
                  location.pathname === item.href
                    ? isScrolled
                      ? "text-blue-600"
                      : "text-white"
                    : isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white hover:text-blue-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Breadcrumb;
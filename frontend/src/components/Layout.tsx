import { FC, ReactNode, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import HeroSection from './HeroSection';
import Breadcrumb from './Breadcrumb';

interface LayoutProps {
  children?: ReactNode;
  showHero?: boolean;
}

const Layout: FC<LayoutProps> = ({ children, showHero = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    // Full width layout with no horizontal constraints
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Breadcrumb isScrolled={isScrolled} />
      
      {showHero && <HeroSection />}
      
      <main className={`flex-grow bg-gray-100 transition-all duration-500 w-full ${
        showHero ? 'pt-8' : 'pt-24'
      }`}>
        {/* Centered content in white card */}
        <div className="w-full px-4 py-8 flex justify-center items-start">
          <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
            {children || <Outlet />}
          </div>
        </div>
      </main>
      
      {/* Placing Footer here, OUTSIDE the container div above, 
          allows it to span 100% width.
      */}
      <Footer />
    </div>
  );
};

export default Layout;
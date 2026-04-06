import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    // "w-full" and "m-0" ensures the blue background touches both side edges
    <footer className="w-full bg-[#0F2A5D] text-white pt-16 pb-8 m-0">
      <div className="w-full px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Column 1: Company Branding */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-6">Africom Technologies</h3>
            <p className="text-gray-300 mb-8 leading-relaxed max-w-sm">
              Empowering businesses across Africa with cutting-edge digital 
              solutions and strategic growth partnerships.
            </p>
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Follow Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <FaLinkedin size={18} />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <FaFacebook size={18} />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <FaYoutube size={18} />
                </a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <FaTwitter size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">BPO Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Software Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IT Consultancy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Quality Assurance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support & Maintenance</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blogs</a></li>
            </ul>
          </div>

          {/* Column 4: Connect (As per Image) */}
          <div>
            <h4 className="font-bold text-lg mb-6">Connect</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Get Started</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Schedule Demo</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Policy Links */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Africom Technologies PLC. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="fixed w-full backdrop-blur-sm z-50 bg-navy/95 border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/cbe1d4d7-1083-4946-abde-1662d0836a39.png" 
              alt="GenZ Immersive Technologies Summit" 
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-genz-yellow transition-colors">
              Home
            </Link>
            <Link to="/speakers" className="text-white hover:text-genz-yellow transition-colors">
              Speakers
            </Link>
            <Link to="/agenda" className="text-white hover:text-genz-yellow transition-colors">
              Agenda
            </Link>
            <Link to="/partners" className="text-white hover:text-genz-yellow transition-colors">
              Partners
            </Link>
            <Link to="/contact" className="text-white hover:text-genz-yellow transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              className="bg-genz-blue hover:bg-genz-purple text-white font-semibold px-6"
              onClick={() => window.open('https://lu.ma/qkiufx1n', '_blank')}
            >
              Register
            </Button>
            
            <button
              className="md:hidden text-white hover:text-genz-yellow"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-genz-yellow py-2">
                Home
              </Link>
              <Link to="/speakers" className="text-white hover:text-genz-yellow py-2">
                Speakers
              </Link>
              <Link to="/agenda" className="text-white hover:text-genz-yellow py-2">
                Agenda
              </Link>
              <Link to="/partners" className="text-white hover:text-genz-yellow py-2">
                Partners
              </Link>
              <Link to="/contact" className="text-white hover:text-genz-yellow py-2">
                Contact
              </Link>
              <Button 
                className="bg-genz-blue hover:bg-genz-purple text-white font-semibold w-full mt-4"
                onClick={() => window.open('https://lu.ma/qkiufx1n', '_blank')}
              >
                Register
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

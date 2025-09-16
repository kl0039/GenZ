import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Twitter, Instagram, Linkedin } from 'lucide-react';
const Footer = () => {
  const [email, setEmail] = useState('');
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Thank you for subscribing to our updates!"
    });
    setEmail('');
  };
  return <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-[27px]">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <img 
              src="/lovable-uploads/cbe1d4d7-1083-4946-abde-1662d0836a39.png" 
              alt="GenZ Immersive Technologies Summit" 
              className="h-8 md:h-10 w-auto mb-6"
            />
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering the next generation of innovators and leaders.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-genz-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/frankiekclai/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-genz-blue transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/107277142" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-genz-blue transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link to="/speakers" className="block text-gray-400 hover:text-white transition-colors">
                Speakers
              </Link>
              <Link to="/agenda" className="block text-gray-400 hover:text-white transition-colors">
                Agenda
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Register
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <div className="space-y-3">
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-400">
              <p className="px-0">📧 m.budlla@surrey.ac.uk</p>
              <p>📧 ka.lai@surrey.ac.uk</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 GenZ Immersive Summit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
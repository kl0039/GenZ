
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export const CookieConsent = () => {
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    
    if (!hasConsent) {
      toast(
        "Cookie Notice",
        {
          duration: Infinity,
          position: "bottom-right",
          className: "bg-black text-white z-[100]", // Increased z-index to ensure it's above other elements
          icon: <Cookie className="h-5 w-5" />,
          description: (
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-lg font-medium">We use cookies to make your experience better. </span>
                To comply with the new e-Privacy directive, we need to ask for your consent to set the cookies.{' '}
                <Link to="/privacy" className="text-white hover:underline">
                  Learn more about Privacy And Cookie Policy
                </Link>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  className="bg-white text-black hover:bg-white/90"
                  onClick={() => {
                    localStorage.setItem('cookieConsent', 'accepted');
                    toast.dismiss();
                  }}
                >
                  ALLOW COOKIES
                </Button>
              </div>
            </div>
          ),
        }
      );
    }
  }, []);

  return null;
};

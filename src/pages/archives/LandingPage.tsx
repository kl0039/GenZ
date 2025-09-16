
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Rocket, Code, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdownDate] = useState(new Date('2025-07-01'));
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = countdownDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdownDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert email into our notification_subscribers table
      const { data, error } = await supabase
        .from('notification_subscribers')
        .insert([{ email, source: 'landing_page' }])
        .select();
      
      if (error) {
        if (error.code === '23505') {
          // Unique violation error code - email already exists
          toast({
            title: "Already subscribed",
            description: "This email is already in our notification list.",
            variant: "default"
          });
        } else {
          console.error("Error submitting email:", error);
          toast({
            title: "Something went wrong",
            description: "Unable to save your email. Please try again later.",
            variant: "destructive"
          });
        }
      } else {
        // Success
        console.log("Email submitted successfully:", data);
        setIsSubmitted(true);
        setEmail('');
        
        toast({
          title: "Thank you!",
          description: "We'll notify you when we launch.",
          variant: "default"
        });
        
        // Reset the submission message after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Exception when submitting email:", err);
      toast({
        title: "Something went wrong",
        description: "Unable to save your email. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#121420] text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full opacity-10 bg-[#9b87f5]"
              style={{
                width: `${Math.random() * 5 + 2}rem`,
                height: `${Math.random() * 5 + 2}rem`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse ${Math.random() * 8 + 4}s infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/57273cc6-cf50-4b5a-8a61-7a3dfe22b5f1.png" 
              alt="AsianFood.ai Logo" 
              className="h-12 w-auto" 
            />
          </div>
          <nav>
            <Link to="/home">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Preview Beta
              </Button>
            </Link>
          </nav>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]">
            AsianFood.ai
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/80">
            The Future of Asian Culinary Experience
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight animate-pulse">
            Coming Soon
          </h2>

          {/* Countdown timer */}
          <div className="grid grid-cols-4 gap-4 md:gap-8 mb-16">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-16 md:w-24 h-16 md:h-24 flex items-center justify-center mb-2">
                  <span className="text-2xl md:text-4xl font-mono">{item.value}</span>
                </div>
                <span className="text-xs md:text-sm text-white/70">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full max-w-4xl">
            {[
              { 
                icon: <Rocket className="h-8 w-8 text-[#9b87f5]" />, 
                title: "AI-Powered Recommendations", 
                description: "Personalized Asian food recommendations based on your preferences and tastes" 
              },
              { 
                icon: <Code className="h-8 w-8 text-[#1EAEDB]" />, 
                title: "Smart Recipe Analysis", 
                description: "Discover authentic Asian recipes with detailed nutritional information" 
              },
              { 
                icon: <Zap className="h-8 w-8 text-[#33C3F0]" />, 
                title: "Cultural Food Journey", 
                description: "Explore the rich culinary heritage of various Asian cultures" 
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Newsletter signup */}
          <div className="w-full max-w-md">
            <h3 className="text-xl mb-4">Get notified when we launch</h3>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-[#9b87f5] flex-grow"
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Notify Me"}
              </Button>
            </form>
            {isSubmitted && (
              <p className="mt-2 text-[#33C3F0] animate-fade-in">Thank you! We'll notify you when we launch.</p>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 mt-auto text-center text-white/50 text-sm">
          <p>© 2025 AsianFood.ai • All rights reserved</p>
          <div className="mt-2">
            <Link to="/privacy" className="hover:text-white mr-4">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-white">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;

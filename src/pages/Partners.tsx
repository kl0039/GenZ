import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const Partners = () => {
  const collaborationBenefits = [
    "Access to engaged students, graduates, and early-stage founders",
    "Opportunities to support skills development and employability",
    "Recognition as an organization that supports innovation, inclusion, and education",
    "Visibility in front of stakeholders from across academia, industry, and government", 
    "New connections with peers and decision-makers across sectors"
  ];

  const partnerOpportunities = [
    "Financial sponsorship at a level aligned with your objectives",
    "Delivering a keynote, joining a panel, or facilitating a workshop",
    "Hosting a booth or demonstration in the Fair & Showcase Zone",
    "Providing mentors for students and teams",
    "Supporting awards or specific programme features",
    "Amplifying the initiative through your communication channels"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-genz-blue via-genz-purple to-genz-yellow overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-genz-blue/90 via-genz-purple/90 to-genz-yellow/90"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-genz-yellow">Partners</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Meet the visionary companies and organizations powering the GenZ Immersive Summit and supporting the next generation of innovators.
          </p>
        </div>
      </section>

      {/* Why Collaborate Section */}
      <section className="py-20 bg-navy">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Collaborate?</h2>
            <p className="text-xl text-white/80">Participation in this initiative offers:</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {collaborationBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <CheckCircle className="text-genz-cyan mt-1 flex-shrink-0" size={24} />
                <p className="text-white text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Partners Can Do Section */}
      <section className="py-20 bg-gradient-to-br from-navy via-purple-900/50 to-navy">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What partners can do?</h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {partnerOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <CheckCircle className="text-genz-cyan mt-1 flex-shrink-0" size={24} />
                <p className="text-white text-lg">{opportunity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-20 bg-gradient-to-br from-genz-blue via-genz-purple to-genz-yellow">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Become a Partner</h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join leading companies in supporting the next generation of innovators. Multiple partner packages available.
          </p>
          
          <div className="flex justify-center">
            <Button className="bg-genz-yellow hover:bg-genz-orange text-navy font-semibold px-8 py-3 text-lg">
              Download Partner Package
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
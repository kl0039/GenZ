import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Rocket, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Speakers = () => {
  return (
    <div className="min-h-screen bg-navy">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-genz-blue via-genz-purple to-genz-orange opacity-90"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Meet Our <span className="text-genz-yellow">Speakers</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Industry leaders, innovators, and visionaries sharing their expertise to inspire the 
            next generation of changemakers.
          </p>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="py-20 bg-genz-purple-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Speakers</h2>
            <p className="text-xl text-white/80">
              Industry experts from various domains mainly represent the following companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Row 1 */}
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center h-32">
                  <img 
                    src="/lovable-uploads/c0f09223-ddad-4623-85fa-4f97417e337d.png" 
                    alt="United Nations" 
                    className="max-h-24 max-w-full w-auto object-contain"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center h-32">
                  <div className="text-6xl font-bold">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center h-32">
                  <img 
                    src="/lovable-uploads/5883695e-23dc-458a-bed8-c9d1c05edd3a.png" 
                    alt="IBM" 
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Row 2 */}
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center h-32">
                  <img 
                    src="/lovable-uploads/1c644792-60a6-4b09-b454-895f1f35267c.png" 
                    alt="Lloyds" 
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center h-32">
                  <img 
                    src="/lovable-uploads/2b457ee1-b564-4a9f-ad16-4e229aaefa79.png" 
                    alt="HSBC" 
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center h-32">
                  <img 
                    src="/lovable-uploads/e12ce127-00a2-4d82-8b12-f4582e0d1282.png" 
                    alt="VISA" 
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Row 3 */}
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center h-32">
                  <img 
                    src="/lovable-uploads/1de68757-2fc6-46ce-a877-5309cc4eda6f.png" 
                    alt="Canva" 
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center h-32">
                  <img 
                    src="/lovable-uploads/da0dfe26-dddb-4900-a0ed-f50506f2bb14.png" 
                    alt="Forbes" 
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center h-32">
                  <img 
                    src="/lovable-uploads/7634ccb7-019d-45de-ab7f-e64936a02c86.png" 
                    alt="BT Group" 
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Speaker Tracks */}
      <section className="py-20 bg-navy">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Speaker Tracks</h2>
            <p className="text-xl text-white/80">
              Organized sessions by topic and expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-genz-blue p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-6">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Tech Innovation</h3>
                <p className="text-white/90 leading-relaxed">
                  AI, Machine Learning, Blockchain, and emerging technologies shaping our future.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-6">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Entrepreneurship</h3>
                <p className="text-white/90 leading-relaxed">
                  Startup strategies, funding, scaling, and building successful businesses from scratch.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-genz-orange p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-6">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Digital Culture</h3>
                <p className="text-white/90 leading-relaxed">
                  Social media, community building, content creation, and digital influence in the modern age.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-genz-blue via-genz-purple to-genz-yellow"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Don't Miss These Incredible Sessions</h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Secure your spot to learn from the best minds shaping the future of 
            technology and innovation.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-genz-yellow text-navy hover:bg-genz-orange font-semibold px-8 py-4 text-lg"
              onClick={() => window.open('https://lu.ma/qkiufx1n', '_blank')}
            >
              Register Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Speakers;
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Star, Trophy, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
const Index = () => {
  return <div className="min-h-screen bg-navy">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-genz-blue via-genz-purple to-genz-orange opacity-90"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                GenZ<br />
                <span className="text-genz-yellow">Immersive</span><br />
                Summit
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Where Gen Z innovators, technologists, and founders converge to shape the future. 
                Join us for an immersive experience that defines tomorrow.
              </p>
              <div className="flex items-center gap-6 mb-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>27 October 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>University Of Surrey, Guildford, England</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-genz-yellow text-navy hover:bg-genz-orange transition-colors font-semibold px-8"
                  onClick={() => window.open('https://lu.ma/qkiufx1n', '_blank')}
                >
                  Register Now
                </Button>
                
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="py-20 bg-genz-purple-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Event Highlights</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Cutting-edge content, networking, and innovation designed specifically for the next generation of leaders.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-genz-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">20+ Speakers</h3>
                <p className="text-white/80 leading-relaxed">
                  Industry leaders, startup founders, and tech innovators sharing their insights and experiences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-genz-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">300-500 Attendees</h3>
                <p className="text-white/80 leading-relaxed">
                  Connect with like-minded Gen Z professionals, students, and entrepreneurs from around the world.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-genz-yellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-8 w-8 text-navy" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Innovation Labs</h3>
                <p className="text-white/80 leading-relaxed">
                  Hands-on workshops and interactive sessions to spark creativity and collaboration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="py-20 bg-navy">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Speakers</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Industry experts from various domains mainly represent the following companies
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center flex items-center justify-center">
                <img 
                  src="/lovable-uploads/ee6405af-e991-4a31-b759-c0f2b7c23306.png" 
                  alt="Bloomberg" 
                  className="max-h-20 max-w-full object-contain"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center flex items-center justify-center">
                <img 
                  src="/lovable-uploads/e810f5ad-6db2-48e5-9c05-401c43cc00c9.png" 
                  alt="Google" 
                  className="max-h-20 max-w-full object-contain"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center flex items-center justify-center">
                <img 
                  src="/lovable-uploads/b6003b6c-9c67-4823-9952-a1f324053efb.png" 
                  alt="Microsoft" 
                  className="max-h-20 max-w-full object-contain"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-20 bg-genz-purple-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Partners</h2>
            <p className="text-xl text-white/80">Powered by industry leaders</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center flex items-center justify-center h-32">
                <img 
                  src="/lovable-uploads/b599f1e0-cf78-4a70-b688-c5a15ee2057a.png" 
                  alt="PlayGPA" 
                  className="h-full w-full object-contain scale-125"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center flex items-center justify-center h-32">
                <img 
                  src="/lovable-uploads/4fe9fae5-7419-44a2-8397-fcbeab544700.png" 
                  alt="TetAR" 
                  className="max-h-24 max-w-full object-contain"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center flex items-center justify-center h-32">
                <img 
                  src="/lovable-uploads/2d7b830d-f9c8-467e-866b-7be4f7cab4b2.png" 
                  alt="Voice of Crypto" 
                  className="max-h-24 max-w-full object-contain"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-0 text-center flex items-center justify-center h-32">
                <img 
                  src="/lovable-uploads/fb68e55d-1251-42aa-91ee-e60ab4fe5f7a.png" 
                  alt="Crypto Mondays London" 
                  className="max-h-24 max-w-full object-contain"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-genz-blue via-genz-purple to-genz-yellow"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Shape the Future?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of Gen Z innovators for three days of inspiration, learning, 
            and networking that will define your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
    </div>;
};
export default Index;

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCulturalArticles } from '@/services/articles';

const CulturalArticles = () => {
  const { data: articles = [] } = useQuery({
    queryKey: ['culturalArticles'],
    queryFn: getCulturalArticles,
  });

  const featuredArticle = articles.length > 0 ? articles[0] : null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-20 h-[600px] relative">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover" 
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/e79420ac88-694397139a646f823e41.png" 
            alt="traditional Asian street food market scene at night with lanterns" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>
        <div className="container mx-auto px-4 relative h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6">Explore Asian Food Culture</h1>
            <p className="text-xl text-white/90 mb-8">Discover the rich history, traditions, and stories behind Asia's most beloved cuisines</p>
            <div className="flex space-x-4">
              <Link to="/blog">
                <button className="bg-asianred-600 text-white px-8 py-4 rounded-lg hover:bg-asianred-700">
                  Start Reading
                </button>
              </Link>
              <Link to="/videos">
                <button className="bg-white/20 text-white px-8 py-4 rounded-lg hover:bg-white/30 backdrop-blur-sm">
                  Watch Videos
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Explore by Region</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "East Asia",
                image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/c5fef4bb4d-b04c25b01247e8b78a45.png",
                count: "124"
              },
              {
                name: "Southeast Asia",
                image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/3bb641b593-a03ccce2e7ac4997cf99.png",
                count: "98"
              },
              {
                name: "South Asia",
                image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/d2c97506d0-c898c56fb29aaeeacdbd.png",
                count: "156"
              },
              {
                name: "Central Asia",
                image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/93d42f78f6-ecfac3ca458e31bed982.png",
                count: "112"
              }
            ].map((region, index) => (
              <div key={index} className="relative h-80 rounded-xl overflow-hidden group cursor-pointer">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  src={region.image} 
                  alt={`${region.name} cuisine`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{region.name}</h3>
                  <span className="text-white/90">{region.count} articles</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Expert Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-6 p-6 bg-gray-50 rounded-xl">
              <img 
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
                className="w-16 h-16 rounded-full" 
                alt="Chef Portrait" 
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">The Philosophy of Umami</h3>
                <p className="text-gray-600 mb-4">Chef Tanaka explores the fifth taste and its role in Japanese cuisine</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Chef Hiroshi Tanaka</span>
                  <span className="mx-2">•</span>
                  <span>15 min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 bg-gray-50 rounded-xl">
              <img 
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" 
                className="w-16 h-16 rounded-full" 
                alt="Chef Portrait" 
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">Preserving Traditional Recipes</h3>
                <p className="text-gray-600 mb-4">How Asian communities are keeping their culinary heritage alive</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Dr. Sarah Chen</span>
                  <span className="mx-2">•</span>
                  <span>12 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-asianred-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Connected with Asian Culture</h2>
            <p className="text-white/90 mb-8">Get weekly insights about Asian cuisine, traditions, and cultural stories</p>
            <div className="flex max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 rounded-l-lg focus:outline-none"
              />
              <button className="bg-gray-900 text-white px-8 py-4 rounded-r-lg hover:bg-gray-800">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CulturalArticles;

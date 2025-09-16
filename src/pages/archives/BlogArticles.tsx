
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, Search, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCulturalArticles } from '@/services/articles';

const BlogArticles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ['culturalArticles'],
    queryFn: getCulturalArticles,
  });

  // Filter articles based on search and region
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = selectedRegion === 'all' || article.region === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  // Get unique regions for filter
  const regions = ['all', ...new Set(articles.map(article => article.region).filter(Boolean))];

  const featuredArticle = articles.length > 0 ? articles[0] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto pt-28 pb-16 px-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-asianred-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto pt-28 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Unable to load articles</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Featured Japan Article Header */}
      <section className="pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            🇯🇵 Japan: Harmony in Every Bite
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore culture, seasonality, and flavor — the Japanese way
          </p>
        </div>
      </section>

      {/* Main Featured Article Content */}
      <section className="py-0 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Featured Image */}
          <figure className="mb-8 text-center">
            <img 
              src="/lovable-uploads/469d7701-0700-4a30-9855-f3b6dc04acc1.png" 
              alt="Sushi, tempura, and ramen assortment"
              className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-2">
              A balanced table: sushi, tempura & soy‑marinated ramen
            </figcaption>
          </figure>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-asianred-600 border-b-2 border-asianred-600 pb-2 mb-4">
              Introduction
            </h2>
            <p className="mb-6 leading-relaxed">
              When people think of Japanese cuisine, sushi, ramen, and sake often come to mind. But behind these iconic dishes lies an intricate philosophy — one rooted in <em>wa</em> (和), the spirit of harmony. In Japan, cooking and dining transcend the act of nourishment; they become rituals that celebrate seasonality, aesthetics, mindfulness, and deep cultural respect.
            </p>
            <p className="mb-6 leading-relaxed">
              At AsianFood.ai, we invite you to explore this world — where every bite tells a story, and every meal becomes a moment of connection.
            </p>

            <h2 className="text-2xl font-bold text-asianred-600 border-b-2 border-asianred-600 pb-2 mb-4 mt-8">
              The Philosophy of Washoku (和食)
            </h2>
            <p className="mb-4 leading-relaxed">
              Japan's traditional culinary culture, <strong>washoku</strong>, was recognized by UNESCO in 2013 as an Intangible Cultural Heritage of Humanity — not only for its flavors, but for its role in preserving social and environmental harmony.
            </p>
            
            <p className="mb-4 leading-relaxed">At its core, washoku embodies a balance of:</p>
            <ul className="list-disc ml-6 mb-6 space-y-2">
              <li><strong>Five Colors:</strong> White, black, red, green, yellow</li>
              <li><strong>Five Flavors:</strong> Sweet, sour, salty, bitter, umami</li>
              <li><strong>Five Techniques:</strong> Raw, simmered, grilled, steamed, fried</li>
            </ul>

            <p className="mb-8 leading-relaxed">
              This balance engages all five senses and honors the natural rhythm of the seasons. Meals are prepared with purpose and presented with grace — because food, in Japan, is not just sustenance. It's an experience.
            </p>

            {/* Second Featured Image */}
            <figure className="mb-8 text-center">
              <img 
                src="/lovable-uploads/f6af6485-bd00-4045-9a20-ab778e4ac68f.png" 
                alt="Shoyu ramen with chashu pork"
                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
              />
              <figcaption className="text-sm text-gray-600 mt-2">
                Slurp-worthy: Tokyo‑style shoyu ramen
              </figcaption>
            </figure>

            <h2 className="text-2xl font-bold text-asianred-600 border-b-2 border-asianred-600 pb-2 mb-4">
              Seasonality: Nature on the Plate
            </h2>
            <p className="mb-6 leading-relaxed">
              Japan reveres the seasons not only in poetry and art — but also on the plate. From bamboo shoots in spring to hot pots in winter, every dish mirrors nature's rhythm.
            </p>

            <h2 className="text-2xl font-bold text-asianred-600 border-b-2 border-asianred-600 pb-2 mb-4">
              Iconic Dishes of Japan
            </h2>
            <ul className="list-disc ml-6 mb-6 space-y-2">
              <li><strong>Sushi & Sashimi:</strong> Minimalist yet precise — sushi balances acidity, texture, and purity.</li>
              <li><strong>Ramen:</strong> A bowl of soul. From Kyushu's rich tonkotsu to Tokyo's shoyu base, ramen varies across regions.</li>
              <li><strong>Tempura:</strong> Vegetables and seafood, lightly battered and fried to golden crispness.</li>
              <li><strong>Kaiseki:</strong> The pinnacle of Japanese fine dining — seasonal, artful, intentional.</li>
            </ul>

            <h2 className="text-2xl font-bold text-asianred-600 border-b-2 border-asianred-600 pb-2 mb-4">
              The Craft of Sake
            </h2>
            <p className="mb-6 leading-relaxed">
              Sake is Japan's traditional rice wine — symbolic, versatile, and crafted with care. Whether you prefer dry <em>junmai</em> or floral <em>daiginjo</em>, sake elevates every moment.
            </p>

            <h2 className="text-2xl font-bold text-asianred-600 border-b-2 border-asianred-600 pb-2 mb-4">
              Rituals and Table Manners
            </h2>
            <p className="mb-6 leading-relaxed">
              Dining etiquette is deeply cultural: say "Itadakimasu" before meals and "Gochisousama deshita" after. Avoid sticking chopsticks upright in rice or passing food from chopstick to chopstick — these gestures are reserved for funerals.
            </p>

            <h2 className="text-2xl font-bold text-asianred-600 border-b-2 border-asianred-600 pb-2 mb-4">
              Daily Life & Street Food
            </h2>
            <p className="mb-6 leading-relaxed">
              Everyday meals often feature rice, miso soup, pickles, and grilled fish. Bento boxes are handmade acts of love, while street foods — from <em>takoyaki</em> to <em>taiyaki</em> — fuel festivals and daily life.
            </p>

            <h2 className="text-2xl font-bold text-asianred-600 border-b-2 border-asianred-600 pb-2 mb-4">
              Bringing Japan to Your Table
            </h2>
            <blockquote className="border-l-4 border-asianred-600 pl-4 italic text-gray-600 mb-6 text-lg">
              "Whether recreating your favorite ramen night or sipping sake under the stars, Japanese food is a journey into harmony."
            </blockquote>
            <p className="mb-8 leading-relaxed">
              At AsianFood.ai, we deliver authentic Japanese flavors to your doorstep — from premium sake and ramen kits to seasonal snacks and artisanal sauces. Rediscover food as culture, connection, and calm. Begin your journey at <a href="https://asianfood.ai" target="_blank" rel="noopener" className="text-asianred-600 hover:text-asianred-700 underline">AsianFood.ai</a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogArticles;

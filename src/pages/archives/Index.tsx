
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import { Button } from '@/components/ui/button';
import { cookingVideos } from '@/services/mockData';
import { getCategories } from '@/services/categories';
import { Category, CookingVideo } from '@/types';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { getCookingVideos } from '@/services/videos';

// Map category names to uploaded icon image URLs
const categoryIcons: Record<string, string> = {
  "Alcohol": "/lovable-uploads/0a3e5ed6-0ecc-456a-a7f4-dab3339ca22c.png",
  "Beauty & Health": "/lovable-uploads/f06c211b-5607-4fe0-aa6b-ec9ab81c9ad5.png",
  "Confectionery and Snacks": "/lovable-uploads/65ae7311-5801-4c26-9b4f-fe62bc6fba32.png",
  "Cooking": "/lovable-uploads/a0ac2a11-a7bd-4444-83de-6cae15263a41.png",
  "Cooking Noodles": "/lovable-uploads/781c3d87-f78e-4437-8330-c31bd4858f34.png",
  "Drinks": "/lovable-uploads/5580c7fd-e802-4390-b23f-55540c1a8e4d.png",
  "Instant Noodles": "/lovable-uploads/f4747fc8-a0ad-41ff-9a64-0011747568c4.png"
};

// List of promotional categories to exclude from Shop by Category
const promotionalCategories = [
  "Buy 2 Get 3 Special",
  "Free Delivery Offers", 
  "Limited Time Offers"
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [playVideo, setPlayVideo] = useState(false);
  const [featuredVideo, setFeaturedVideo] = useState<CookingVideo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      // Filter out promotional categories
      const filteredCategories = fetchedCategories.filter(category => 
        !promotionalCategories.includes(category.name)
      );
      setCategories(filteredCategories);
    };

    const fetchFeaturedVideo = async () => {
      try {
        const videos = await getCookingVideos();
        if (videos && videos.length > 0) {
          setFeaturedVideo(videos[0]);
        } else {
          setFeaturedVideo(cookingVideos[0]);
        }
      } catch (error) {
        console.error("Error fetching featured video:", error);
        setFeaturedVideo(cookingVideos[0]);
      }
    };

    fetchCategories();
    fetchFeaturedVideo();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-20">
        <div className="container mx-auto px-4">
          <div className="relative my-8">
            <div className="flex items-center justify-center w-full">
              <input
                type="text"
                placeholder="Search for products, recipes, or ingredients..."
                className="w-full max-w-3xl px-6 py-4 rounded-lg text-gray-700 focus:outline-none shadow-sm border border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-2 px-6 py-4 text-gray-600 hover:text-asianred-600">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <HeroSlider />
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map(category => {
              const iconSrc = categoryIcons[category.name];
              const urlFriendlyName = category.name
                .toLowerCase()
                .replace(/&/g, '-and-')
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
              
              return (
                <Link to={`/products/${urlFriendlyName}`} key={category.id} className="group">
                  <div className="bg-red-50 rounded-xl p-6 text-center transition-all group-hover:bg-red-100 h-full flex flex-col items-center justify-center min-h-[140px]">
                    {iconSrc ? (
                      <img
                        src={iconSrc}
                        alt={`${category.name} icon`}
                        className="h-12 w-12 object-contain mb-4"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">IMG</span>
                      </div>
                    )}
                    <h3 className="font-semibold text-sm leading-tight">{category.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Video</h2>
          <div className="relative rounded-2xl overflow-hidden">
            {playVideo && featuredVideo ? (
              <YouTubeEmbed 
                videoUrl={featuredVideo.video_url}
                className="w-full aspect-video"
              />
            ) : (
              featuredVideo && (
                <>
                  <img
                    className="w-full h-[500px] object-cover"
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button 
                      onClick={() => setPlayVideo(true)}
                      className="bg-white/90 rounded-full w-20 h-20 flex items-center justify-center hover:bg-white transition-all"
                    >
                      <Play className="h-8 w-8 ml-1 text-asianred-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black">
                    <h3 className="text-2xl font-bold text-white mb-2">{featuredVideo.title}</h3>
                    <p className="text-white/90 mb-4">{featuredVideo.description}</p>
                    <Button 
                      onClick={() => setPlayVideo(true)}
                      className="bg-asianred-600 hover:bg-asianred-700 text-white"
                    >
                      Watch Now
                    </Button>
                  </div>
                </>
              )
            )}
            {!featuredVideo && (
              <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No featured video available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

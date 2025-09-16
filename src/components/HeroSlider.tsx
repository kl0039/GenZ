
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/7c8837abb7-fca9e52a07212b757122.png",
    title: "Limited Time Sale",
    description: "Exclusive deals on premium Asian ingredients",
    buttonText: "Shop Now",
    buttonLink: "/sale",
  },
  {
    id: 2,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/7c8837abb7-0dc2c708d952165952a7.png",
    title: "Buy 2 Get 3",
    description: "Special bundles for your favorite products",
    buttonText: "View Bundles",
    buttonLink: "/bundles",
  },
  {
    id: 3,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/7c8837abb7-67df622fe83458d18c29.png",
    title: "Free Delivery",
    description: "On orders over £50 - UK wide shipping",
    buttonText: "Learn More",
    buttonLink: "/delivery",
  },
  {
    id: 4,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/7c8837abb7-e62bdbbe4e451d5d63a1.png",
    title: "Easter Festival",
    description: "Discover special recipes for the holiday",
    buttonText: "Explore",
    buttonLink: "/festivals",
  },
  {
    id: 5,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/7c8837abb7-be4a2607821c767e81d6.png",
    title: "Happy Snack",
    description: "Authentic snacks from across Asia",
    buttonText: "Browse Snacks",
    buttonLink: "/snacks",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentSlide ? 'hero-slide-active' : 'hero-slide-inactive'}`}
        >
          <img className="w-full h-full object-cover" src={slide.image} alt={slide.title} />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black">
            <div className="container mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{slide.title}</h2>
              <p className="text-lg md:text-xl text-white/90 mb-6">{slide.description}</p>
              <Link to={slide.buttonLink}>
                <Button className="bg-asianred-600 hover:bg-asianred-700 text-white">
                  {slide.buttonText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slide-indicator ${index === currentSlide ? 'slide-indicator-active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, ShoppingCart, User, SlidersHorizontal, Bot, Clock, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { recipes } from '@/services/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Recipes = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Personalized Recommendations</h1>
              <p className="text-gray-600">Curated just for you based on your preferences and shopping history</p>
            </div>
            <Button variant="ghost" className="text-red-600 hover:text-red-700">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Adjust Preferences
            </Button>
          </div>
        </div>
      </section>

      <section className="pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">AI Shopping Assistant Insights</h2>
                <p className="text-gray-600">Based on your recent purchase of Japanese curry ingredients, you might enjoy exploring these complementary items.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 rounded-xl p-4">
                <Clock className="text-red-600 mb-2 h-5 w-5" />
                <h3 className="font-semibold mb-1">Recent Interests</h3>
                <p className="text-sm text-gray-600">Japanese cuisine, particularly curry and ramen ingredients</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <Star className="text-red-600 mb-2 h-5 w-5" />
                <h3 className="font-semibold mb-1">Favorite Categories</h3>
                <p className="text-sm text-gray-600">Condiments, Fresh Produce, Ready-to-Cook Meals</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <TrendingUp className="text-red-600 mb-2 h-5 w-5" />
                <h3 className="font-semibold mb-1">Shopping Patterns</h3>
                <p className="text-sm text-gray-600">Weekly grocery shopper, interested in authentic ingredients</p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recipe Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden">
                  <div className="h-48 relative">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{recipe.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {recipe.cookingTime} mins • {recipe.difficulty} • {recipe.rating}★
                    </p>
                    <Button variant="ghost" className="text-red-600 hover:text-red-700">
                      <span>View Recipe</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Recipes;

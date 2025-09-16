
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, ArrowLeft, BookOpen, Share2, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getArticleById } from '@/services/articles';
import { getRelatedArticles } from '@/services/articles';
import { CulturalArticle, Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { products } from '@/services/mockData';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id || ''),
  });
  
  const { data: relatedArticles = [] } = useQuery({
    queryKey: ['relatedArticles', id],
    queryFn: () => getRelatedArticles(id || ''),
    enabled: !!article,
  });

  // Mock reading time calculation
  const readingTime = 8; // minutes
  
  // Mock related products - in a real app would be fetched based on the article
  const relatedProducts = products.slice(0, 4);

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

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto pt-28 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/articles">
            <Button className="bg-asianred-600 hover:bg-asianred-700">Return to Articles</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <div className="mb-6">
            <Link to="/articles" className="inline-flex items-center text-gray-600 hover:text-asianred-600 transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Back to Articles
            </Link>
          </div>
          
          {/* Article header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">{article.region}</Badge>
              {article.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{article.publishDate}</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={16} className="mr-2" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Featured image */}
          <div className="max-w-5xl mx-auto mb-12">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-[400px] object-cover rounded-xl"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Main content */}
            <div className="lg:col-span-8">
              <div className="prose prose-lg max-w-none">
                {/* Article content - in a real app, this would be properly formatted HTML/Markdown */}
                <p className="lead">{article.summary}</p>
                
                <h2>The Cultural Significance</h2>
                <p>
                  Asian cuisine is intrinsically connected to cultural heritage, with recipes and cooking techniques
                  passed down through generations. In {article.region}, food is not just sustenance but a way of
                  expressing cultural identity and preserving traditions.
                </p>
                
                <h2>Historical Context</h2>
                <p>
                  The culinary traditions of {article.region} have been shaped by centuries of history, including
                  trade routes, colonization, migration, and cultural exchanges. These influences have created the
                  unique flavor profiles and cooking methods that characterize the regional cuisine.
                </p>
                
                <blockquote>
                  "Food is our common ground, a universal experience that connects people across cultures and generations."
                  <footer>— James Beard</footer>
                </blockquote>
                
                <h2>Key Ingredients</h2>
                <p>
                  The distinctive flavors of {article.region} cuisine come from a combination of local herbs, spices,
                  and cooking techniques unique to the region. Many of these ingredients have been used for their
                  medicinal properties as well as their flavor profiles.
                </p>
                
                <h2>Modern Interpretations</h2>
                <p>
                  While traditional techniques remain important, modern chefs are reinventing classics with contemporary
                  twists, making Asian cuisine more accessible to global audiences while still honoring its roots.
                </p>
                
                <h2>Conclusion</h2>
                <p>
                  Understanding the cultural context of {article.region} cuisine enhances not just the dining experience
                  but also appreciation for the rich heritage behind each dish. As global interest in authentic Asian
                  cooking grows, preserving these culinary traditions becomes increasingly important.
                </p>
              </div>
              
              {/* Article actions */}
              <div className="flex items-center justify-between mt-12 py-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Share2 size={16} />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    Comment
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
              
              {/* Author bio */}
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback>{article.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">About {article.author}</h3>
                    <p className="text-gray-600">
                      Food writer and culinary expert specializing in {article.region} cuisine.
                      With over 10 years of experience exploring food cultures across Asia.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Related articles */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.slice(0, 2).map((relatedArticle: CulturalArticle) => (
                    <Link to={`/article/${relatedArticle.id}`} key={relatedArticle.id} className="group">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                          <img 
                            src={relatedArticle.image} 
                            alt={relatedArticle.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium group-hover:text-asianred-600 transition-colors">
                            {relatedArticle.title}
                          </h3>
                          <div className="text-xs text-gray-500 mt-2 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {relatedArticle.publishDate}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28">
                {/* Related products */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4">Related Products</h3>
                  <div className="space-y-4">
                    {relatedProducts.slice(0, 3).map((product: Product) => (
                      <Link to={`/product/${product.id}`} key={product.id} className="group">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium group-hover:text-asianred-600 transition-colors">
                              {product.name}
                            </h4>
                            <div className="text-sm font-medium text-asianred-600 mt-1">
                              £{product.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Products
                  </Button>
                </div>
                
                {/* Newsletter signup */}
                <div className="bg-asianred-600 text-white rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-2">Subscribe to Our Newsletter</h3>
                  <p className="text-sm mb-4 text-white/90">
                    Get the latest articles, recipes, and product recommendations.
                  </p>
                  <form className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full px-4 py-2 rounded-md text-gray-800"
                    />
                    <Button className="w-full bg-white text-asianred-600 hover:bg-gray-100">
                      Subscribe
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;

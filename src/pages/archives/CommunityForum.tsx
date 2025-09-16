import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, ThumbsUp, Calendar, Eye, Search, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  date: string;
  likes: number;
  views: number;
  replies: number;
  isSticky?: boolean;
  isAnnouncement?: boolean;
}

const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    title: "What's the best brand of fish sauce?",
    content: "I'm looking for recommendations on the best fish sauce brands available in the UK...",
    author: {
      id: 'user1',
      name: 'Sarah Wong',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    category: 'Ingredients',
    tags: ['fish sauce', 'recommendations'],
    date: '2023-04-10',
    likes: 24,
    views: 342,
    replies: 18
  },
  {
    id: '2',
    title: "Traditional vs. modern Kimchi recipes",
    content: "I've been experimenting with kimchi recipes and wanted to discuss the differences...",
    author: {
      id: 'user2',
      name: 'Min-Jun Park',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    category: 'Recipes',
    tags: ['kimchi', 'korean', 'fermentation'],
    date: '2023-04-08',
    likes: 45,
    views: 612,
    replies: 32,
    isSticky: true
  },
  {
    id: '3',
    title: 'April Community Meetup in London',
    content: 'Join us for a community potluck and cooking demonstration in Central London...',
    author: {
      id: 'admin1',
      name: 'AsianFood.ai Team',
      avatar: '/logo.png'
    },
    category: 'Events',
    tags: ['meetup', 'london', 'community'],
    date: '2023-04-05',
    likes: 87,
    views: 943,
    replies: 56,
    isAnnouncement: true
  }
];

const CommunityForum = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'recipes', name: 'Recipes' },
    { id: 'ingredients', name: 'Ingredients' },
    { id: 'techniques', name: 'Techniques' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'events', name: 'Events' },
  ];

  const filterPosts = () => {
    return MOCK_FORUM_POSTS.filter(post => {
      if (activeCategory !== 'all' && post.category.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }
      
      if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !post.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredPosts = filterPosts();
  const announcements = filteredPosts.filter(post => post.isAnnouncement);
  const stickyPosts = filteredPosts.filter(post => post.isSticky && !post.isAnnouncement);
  const regularPosts = filteredPosts.filter(post => !post.isSticky && !post.isAnnouncement);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Community Forum</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with fellow Asian cuisine enthusiasts, share recipes, and get cooking advice.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <form onSubmit={handleSearch} className="w-full md:w-auto flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  type="text" 
                  placeholder="Search discussions..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} /> Filters
              </Button>
              <Button className="bg-asianred-600 hover:bg-asianred-700">
                Start New Discussion
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start space-x-2 p-1">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="whitespace-nowrap"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <div className="space-y-8">
            {announcements.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Announcements</h2>
                {announcements.map(post => (
                  <div key={post.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        {post.author.avatar ? (
                          <AvatarImage src={post.author.avatar} />
                        ) : (
                          <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-blue-600">Announcement</Badge>
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <h3 className="font-medium text-lg">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="font-medium">{post.author.name}</span>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {post.date}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            {post.replies} replies
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {stickyPosts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Featured Discussions</h2>
                {stickyPosts.map(post => (
                  <div key={post.id} className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        {post.author.avatar ? (
                          <AvatarImage src={post.author.avatar} />
                        ) : (
                          <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Featured</Badge>
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <h3 className="font-medium text-lg">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="font-medium">{post.author.name}</span>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {post.date}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            {post.replies} replies
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <ThumbsUp className="mx-auto" size={16} />
                        <div className="text-sm font-medium">{post.likes}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {regularPosts.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Discussions</h2>
                {regularPosts.map(post => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        {post.author.avatar ? (
                          <AvatarImage src={post.author.avatar} />
                        ) : (
                          <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <h3 className="font-medium text-lg">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="font-medium">{post.author.name}</span>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {post.date}
                          </div>
                          <div className="flex items-center">
                            <Eye size={14} className="mr-1" />
                            {post.views} views
                          </div>
                          <div className="flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            {post.replies} replies
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <ThumbsUp className="mx-auto" size={16} />
                        <div className="text-sm font-medium">{post.likes}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No discussions found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || activeCategory !== 'all' ? 
                    'Try adjusting your filters or search terms.' : 
                    'Be the first to start a discussion in this community.'}
                </p>
                <Button className="bg-asianred-600 hover:bg-asianred-700">
                  Start New Discussion
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Community Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4">
                <h3 className="font-medium mb-2">Be Respectful</h3>
                <p className="text-sm text-gray-600">Treat others with respect. No offensive language or personal attacks.</p>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Share Knowledge</h3>
                <p className="text-sm text-gray-600">We're here to learn from each other. Share recipes and techniques freely.</p>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Stay On Topic</h3>
                <p className="text-sm text-gray-600">Keep discussions related to Asian cuisine, cooking, and food culture.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommunityForum;


import React from 'react';
import { Bell, Eye, Heart, Plus, Video, Bookmark, MessageSquare, MoreHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const LiveCooking = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section id="live-sessions" className="pt-20">
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Live Cooking Sessions</h2>
                <Button className="bg-asianred-600 text-white px-6 py-3 rounded-lg hover:bg-asianred-700">
                    <Video className="mr-2 h-4 w-4" />Start Streaming
                </Button>
            </div>

            <div id="live-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div id="main-stream" className="lg:col-span-2 bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="relative">
                        <img className="w-full h-[400px] object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/76c90acbbf-a78f553e2bd6f691a008.png" alt="professional chef demonstrating dim sum making" />
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-asianred-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                                <span className="bg-white rounded-full h-2 w-2 mr-2"></span>
                                LIVE
                            </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black">
                            <div className="flex items-center mb-4">
                                <Avatar>
                                    <AvatarImage src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" />
                                    <AvatarFallback>MC</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                    <h3 className="text-white font-semibold">Chef Michael Chen</h3>
                                    <p className="text-gray-300 text-sm">Master Dim Sum Techniques</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-white flex items-center"><Eye className="mr-2 h-4 w-4" />1.2k watching</span>
                                <span className="text-white flex items-center"><Heart className="mr-2 h-4 w-4" />856</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="upcoming-sessions" className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
                    <div id="upcoming-1" className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <img className="w-full h-48 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/e151f7b6b4-da26f5ad0042a20366b7.png" alt="chef preparing sushi rolls" />
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-asianred-600">Tomorrow, 2:00 PM</span>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-asianred-600 p-0">
                                    <Bell className="h-4 w-4" />
                                </Button>
                            </div>
                            <h4 className="font-semibold mb-2">Sushi Making Masterclass</h4>
                            <div className="flex items-center">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" />
                                    <AvatarFallback>CT</AvatarFallback>
                                </Avatar>
                                <span className="ml-2 text-sm text-gray-600">Chef Tanaka</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="community" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Community Discussions</h2>
                <Button className="bg-asianred-600 text-white px-6 py-3 rounded-lg hover:bg-asianred-700">
                    <Plus className="mr-2 h-4 w-4" />New Post
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div id="discussion-feed" className="lg:col-span-2 space-y-6">
                    <div id="post-1" className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Avatar>
                                    <AvatarImage src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" />
                                    <AvatarFallback>SC</AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                    <h4 className="font-semibold">Sarah Chen</h4>
                                    <span className="text-sm text-gray-500">2 hours ago</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-gray-700 mb-4">Just made my first batch of homemade kimchi! Would love some feedback on the fermentation process.</p>
                        <img className="w-full h-64 object-cover rounded-lg mb-4" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/9f91015833-cd5ff74818a2e4e9a651.png" alt="homemade kimchi in glass jars" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600 p-0">
                                    <Heart className="h-4 w-4" />
                                    <span>234</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600 p-0">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>45</span>
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="text-gray-600 p-0">
                                <Bookmark className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div id="community-sidebar" className="space-y-6">
                    <div id="trending-topics" className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-semibold mb-4">Trending Topics</h3>
                        <div className="space-y-3">
                            {["KoreanBBQ", "DimSumTips", "RamenRecipes"].map((topic) => (
                                <div key={topic} className="flex items-center text-gray-700 hover:text-asianred-600 cursor-pointer">
                                    <span className="text-asianred-600 mr-2 text-xs">🔥</span>
                                    <span>#{topic}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div id="active-members" className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="font-semibold mb-4">Active Members</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Avatar>
                                    <AvatarImage src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg" />
                                    <AvatarFallback>LW</AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                    <h4 className="font-semibold">Lisa Wang</h4>
                                    <span className="text-sm text-gray-500">Top Contributor</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Avatar>
                                    <AvatarImage src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg" />
                                    <AvatarFallback>EC</AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                    <h4 className="font-semibold">Emma Chen</h4>
                                    <span className="text-sm text-gray-500">Recipe Expert</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
      
      <Footer />
    </div>
  );
};

export default LiveCooking;

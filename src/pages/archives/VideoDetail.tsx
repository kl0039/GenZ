
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { Button } from '@/components/ui/button';
import { getVideoById, getRelatedVideos } from '@/services/videos';
import { CookingVideo } from '@/types';

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<CookingVideo | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<CookingVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      if (id) {
        const videoData = await getVideoById(id);
        setVideo(videoData);
        
        const related = await getRelatedVideos(id);
        setRelatedVideos(related);
      }
      setLoading(false);
    };
    
    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-pulse w-16 h-16 border-4 border-asianred-600 border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Video Not Found</h1>
          <p className="mb-8">The video you are looking for does not exist or has been removed.</p>
          <Link to="/live-cooking">
            <Button>Browse All Videos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-asianred-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
        <p className="text-gray-600 mb-8">{video.description}</p>
        
        <div className="mb-8">
          <YouTubeEmbed videoUrl={video.video_url} className="rounded-xl overflow-hidden shadow-lg" />
        </div>
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
          <div>
            <p className="font-medium">{video.chef}</p>
            <p className="text-sm text-gray-500">{video.views.toLocaleString()} views</p>
          </div>
          <div className="text-sm text-gray-500">
            {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : ''}
          </div>
        </div>
        
        {relatedVideos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Related Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVideos.map(relatedVideo => (
                <Link to={`/video/${relatedVideo.id}`} key={relatedVideo.id} className="group">
                  <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md transition-all group-hover:shadow-lg">
                    <div className="relative aspect-video">
                      <img 
                        src={relatedVideo.thumbnail} 
                        alt={relatedVideo.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium group-hover:text-asianred-600 transition-colors">{relatedVideo.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{relatedVideo.views.toLocaleString()} views</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default VideoDetail;

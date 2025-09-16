
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CookingVideo } from "@/types";

interface VideoSectionProps {
  relatedVideos: CookingVideo[];
  selectedVideo: CookingVideo | null;
  setSelectedVideo: (video: CookingVideo | null) => void;
  productImage: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  relatedVideos,
  selectedVideo,
  setSelectedVideo,
  productImage,
}) => {
  // Don't render anything if there are no videos
  if (!relatedVideos || relatedVideos.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Watch Related Videos</h2>
      {selectedVideo ? (
        <div className="mb-8">
          <YouTubeEmbed videoUrl={selectedVideo.video_url} />
          <div className="mt-4">
            <h3 className="font-medium text-lg">{selectedVideo.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{selectedVideo.description}</p>
            <Button 
              variant="outline" 
              onClick={() => setSelectedVideo(null)}
              className="mt-4"
            >
              Back to Videos
            </Button>
          </div>
        </div>
      ) : (
        <Carousel className="w-full">
          <CarouselContent>
            {relatedVideos.map((video) => (
              <CarouselItem key={video.id} className="md:basis-1/2 lg:basis-1/3">
                <div 
                  className="relative group overflow-hidden rounded-lg cursor-pointer" 
                  onClick={() => setSelectedVideo(video)}
                >
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={video.thumbnail || video.thumbnail_url || productImage} 
                      alt={video.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="rounded-full bg-white text-asianred-600 hover:bg-asianred-100"
                    >
                      <Play className="h-6 w-6 fill-asianred-600" />
                      <span className="sr-only">Play video</span>
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-medium line-clamp-2">{video.title}</h3>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {relatedVideos.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
};

export default VideoSection;


import React from 'react';

interface YouTubeEmbedProps {
  videoUrl: string;
  className?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoUrl, className = '' }) => {
  // Extract YouTube video ID from various URL formats
  const getYouTubeId = (url: string) => {
    // Handle YouTube Shorts URLs
    if (url.includes('youtube.com/shorts/')) {
      const shortsId = url.split('shorts/')[1]?.split('?')[0];
      return shortsId || null;
    }
    
    // Handle standard YouTube URLs
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    console.error('Invalid YouTube URL or could not extract video ID:', videoUrl);
    return <div className="p-4 bg-red-100 text-red-700 rounded">Invalid YouTube URL</div>;
  }

  return (
    <div className={`aspect-video w-full ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="w-full h-full"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeEmbed;


import { supabase } from "@/integrations/supabase/client";
import { CookingVideo } from '@/types';

// Convert Supabase video to app CookingVideo format
const mapVideoDtoToVideo = (videoData: any): CookingVideo => {
  return {
    id: videoData.id,
    title: videoData.title,
    description: videoData.description || '',
    thumbnail: videoData.thumbnail_url || '',
    video_url: videoData.youtube_url,
    duration: videoData.duration || 0,
    views: videoData.views || 0,
    chef: videoData.chef || '',
    cuisine_type: videoData.cuisine_type || '',
    created_at: videoData.created_at,
    updated_at: videoData.updated_at,
    video_type: videoData.video_type as CookingVideo['video_type']
  };
};

// Map CookingVideo to Supabase format for inserts/updates
const mapVideoToDto = (video: CookingVideo) => {
  // Ensure video_type is one of the allowed values
  const allowedVideoTypes: ('Recipe' | 'Food Culture' | 'Category' | 'Item')[] = ['Recipe', 'Food Culture', 'Category', 'Item'];
  const videoType = allowedVideoTypes.includes(video.video_type as any) ? video.video_type : 'Recipe';
  
  return {
    title: video.title,
    description: video.description,
    thumbnail_url: video.thumbnail,
    youtube_url: video.video_url,
    video_type: videoType as 'Recipe' | 'Food Culture' | 'Category' | 'Item',
    related_id: video.relatedProducts?.[0] // Use first related product if available
  };
};

// Fetch all videos
export const fetchAllVideos = async (): Promise<CookingVideo[]> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapVideoDtoToVideo);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

// Create a new video
export const createVideo = async (video: CookingVideo): Promise<CookingVideo | null> => {
  try {
    const videoData = mapVideoToDto(video);
    const { data, error } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapVideoDtoToVideo(data);
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

// Update an existing video
export const updateVideo = async (video: CookingVideo): Promise<CookingVideo | null> => {
  try {
    const videoData = mapVideoToDto(video);
    const { data, error } = await supabase
      .from('videos')
      .update(videoData)
      .eq('id', video.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapVideoDtoToVideo(data);
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

// Delete a video
export const deleteVideo = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// Fetch video by ID
export const fetchVideoById = async (id: string): Promise<CookingVideo | null> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return mapVideoDtoToVideo(data);
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    return null;
  }
};

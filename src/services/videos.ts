import { CookingVideo } from '@/types';
import { cookingVideos as mockVideos } from './mockData';
import { fetchAllVideos as fetchSupabaseVideos, fetchVideoById as fetchSupabaseVideoById } from './supabaseVideos';
import { supabase } from "@/integrations/supabase/client";

export const getCookingVideos = async (): Promise<CookingVideo[]> => {
  try {
    const videos = await fetchSupabaseVideos();
    
    if (videos.length === 0) {
      console.log('No videos found in database, using mock data');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockVideos;
    }
    
    return videos;
  } catch (error) {
    console.error('Error fetching videos, falling back to mock data:', error);
    return mockVideos;
  }
};

export const getVideoById = async (id: string): Promise<CookingVideo | null> => {
  try {
    const video = await fetchSupabaseVideoById(id);
    
    if (video) {
      return video;
    }
    
    console.log('Video not found in database, searching in mock data');
    const mockVideo = mockVideos.find(v => v.id === id) || null;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockVideo;
  } catch (error) {
    console.error('Error fetching video, falling back to mock data:', error);
    return mockVideos.find(v => v.id === id) || null;
  }
};

export const getRelatedVideos = async (id: string): Promise<CookingVideo[]> => {
  const video = mockVideos.find(v => v.id === id);
  
  if (!video) {
    return [];
  }
  
  let relatedVideos = mockVideos.filter(v => 
    v.id !== id && 
    v.relatedProducts && video.relatedProducts &&
    v.relatedProducts.some(pid => video.relatedProducts.includes(pid))
  );
  
  if (relatedVideos.length < 3) {
    const additionalVideos = mockVideos.filter(v => 
      v.id !== id && 
      !relatedVideos.map(rv => rv.id).includes(v.id)
    );
    
    relatedVideos = [...relatedVideos, ...additionalVideos];
  }
  
  relatedVideos = relatedVideos.slice(0, 3);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return relatedVideos;
};

export const getProductVideos = async (productId: string): Promise<CookingVideo[]> => {
  try {
    console.log(`Fetching videos for product: ${productId}`);
    
    // First, get the product's primary video_id
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('video_id')
      .eq('id', productId)
      .single();
    
    if (productError) {
      console.error('Error fetching product video ID:', productError);
    }
    
    // If the product doesn't have a video_id, return empty array
    if (!product?.video_id) {
      console.log(`Product ${productId} has no video_id, returning empty array`);
      return [];
    }
    
    let videos: CookingVideo[] = [];
    
    // Fetch the primary video if it exists
    console.log(`Fetching primary video: ${product.video_id}`);
    const primaryVideo = await fetchSupabaseVideoById(product.video_id);
    if (primaryVideo) {
      console.log(`Found primary video: ${primaryVideo.title}`);
      videos.push(primaryVideo);
    }
    
    // Fetch related videos where related_id matches the product ID
    const { data: relatedVideos, error: relatedError } = await supabase
      .from('videos')
      .select('*')
      .eq('related_id', productId);
    
    if (relatedError) {
      console.error('Error fetching related videos:', relatedError);
    } else if (relatedVideos && relatedVideos.length > 0) {
      console.log(`Found ${relatedVideos.length} related videos`);
      
      const appFormatVideos = relatedVideos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description || '',
        thumbnail: video.thumbnail_url || '',
        video_url: video.youtube_url,
        duration: 0,
        views: 0,
        chef: '',
        cuisine_type: video.video_type === 'Recipe' ? 'Asian' : undefined,
        created_at: video.created_at,
        updated_at: video.updated_at
      }));
      
      // Add related videos that aren't already in the list
      appFormatVideos.forEach(video => {
        if (!videos.some(v => v.id === video.id)) {
          videos.push(video);
        }
      });
    }
    
    console.log(`Returning ${videos.length} videos for product ${productId}`);
    return videos;
  } catch (error) {
    console.error('Error in getProductVideos:', error);
    return [];
  }
};

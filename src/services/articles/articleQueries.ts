
import { supabase } from "@/integrations/supabase/client";
import { CulturalArticle } from '@/types';

// Type for Supabase cultural article from database
export interface SupabaseCulturalArticle {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  author: string;
  image_url: string | null;
  reading_time: number | null;
  tags: string[] | null;
  region: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Convert Supabase article to app CulturalArticle type
const convertToAppArticle = (dbArticle: SupabaseCulturalArticle): CulturalArticle => {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    content: dbArticle.content,
    summary: dbArticle.summary || '',
    author: dbArticle.author,
    image: dbArticle.image_url || '',
    reading_time: dbArticle.reading_time || 5,
    tags: dbArticle.tags || [],
    region: dbArticle.region || undefined,
    created_at: dbArticle.created_at || undefined,
    updated_at: dbArticle.updated_at || undefined,
    // For backward compatibility
    publishDate: dbArticle.created_at || undefined
  };
};

// Fetch all cultural articles
export const fetchArticles = async (): Promise<CulturalArticle[]> => {
  try {
    const { data, error } = await supabase
      .from('cultural_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }

    return (data as unknown as SupabaseCulturalArticle[]).map(convertToAppArticle);
  } catch (error) {
    console.error('Error in fetchArticles:', error);
    return [];
  }
};

// Get article by ID
export const fetchArticleById = async (id: string): Promise<CulturalArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('cultural_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      throw error;
    }

    return convertToAppArticle(data as unknown as SupabaseCulturalArticle);
  } catch (error) {
    console.error('Error in fetchArticleById:', error);
    return null;
  }
};

// Get related articles
export const fetchRelatedArticles = async (id: string): Promise<CulturalArticle[]> => {
  try {
    // First get the current article to find its region or tags
    const { data: currentArticle, error: currentError } = await supabase
      .from('cultural_articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (currentError || !currentArticle) {
      console.error('Error fetching current article:', currentError);
      return [];
    }
    
    const article = currentArticle as unknown as SupabaseCulturalArticle;
    
    // Query for related articles based on region or tags
    const query = supabase
      .from('cultural_articles')
      .select('*')
      .neq('id', id)
      .order('created_at', { ascending: false })
      .limit(4);
    
    // Add filters based on what we have
    if (article.region) {
      query.eq('region', article.region);
    } else if (article.tags && article.tags.length > 0) {
      // This uses PostgreSQL array overlap operator && to find articles with any matching tags
      query.contains('tags', article.tags);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching related articles:', error);
      throw error;
    }
    
    return (data as unknown as SupabaseCulturalArticle[]).map(convertToAppArticle);
  } catch (error) {
    console.error('Error in fetchRelatedArticles:', error);
    return [];
  }
};

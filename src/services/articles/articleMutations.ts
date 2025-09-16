
import { supabase } from "@/integrations/supabase/client";
import { CulturalArticle } from '@/types';

// Convert app CulturalArticle to Supabase format
const convertToDbArticle = (article: Omit<CulturalArticle, 'id' | 'created_at' | 'updated_at'>) => {
  return {
    title: article.title,
    content: article.content,
    summary: article.summary || '',
    author: article.author,
    image_url: article.image || '',
    reading_time: article.reading_time || 5,
    tags: article.tags || [],
    region: article.region || null,
  };
};

// Create a new article
export const createArticle = async (article: Omit<CulturalArticle, 'id' | 'created_at' | 'updated_at'>): Promise<CulturalArticle | null> => {
  try {
    const dbArticle = convertToDbArticle(article);
    
    const { data, error } = await supabase
      .from('cultural_articles')
      .insert(dbArticle)
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      summary: data.summary || '',
      author: data.author,
      image: data.image_url || '',
      reading_time: data.reading_time || 5,
      tags: data.tags || [],
      region: data.region || undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error('Error in createArticle:', error);
    return null;
  }
};

// Update an existing article
export const updateArticle = async (id: string, article: Partial<CulturalArticle>): Promise<CulturalArticle | null> => {
  try {
    const updateData: any = {};
    
    if (article.title) updateData.title = article.title;
    if (article.content) updateData.content = article.content;
    if (article.summary) updateData.summary = article.summary;
    if (article.author) updateData.author = article.author;
    if (article.image) updateData.image_url = article.image;
    if (article.reading_time) updateData.reading_time = article.reading_time;
    if (article.tags) updateData.tags = article.tags;
    if (article.region) updateData.region = article.region;

    const { data, error } = await supabase
      .from('cultural_articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating article:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      summary: data.summary || '',
      author: data.author,
      image: data.image_url || '',
      reading_time: data.reading_time || 5,
      tags: data.tags || [],
      region: data.region || undefined,
      created_at: data.created_at || undefined,
      updated_at: data.updated_at || undefined
    };
  } catch (error) {
    console.error('Error in updateArticle:', error);
    return null;
  }
};

// Delete an article
export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cultural_articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteArticle:', error);
    return false;
  }
};

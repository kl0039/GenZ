
import { supabase } from "@/integrations/supabase/client";
import { CulturalArticle } from "@/types";

// Convert Supabase article data to app CulturalArticle format
const mapArticleDtoToArticle = (articleData: any): CulturalArticle => {
  return {
    id: articleData.id,
    title: articleData.title,
    content: articleData.content,
    author: articleData.author,
    image: articleData.image_url || '',
    reading_time: articleData.reading_time,
    tags: articleData.tags || [],
    summary: articleData.summary,
    region: articleData.region,
    created_at: articleData.created_at,
    updated_at: articleData.updated_at
  };
};

// Map CulturalArticle to Supabase format for inserts/updates
const mapArticleToDto = (article: CulturalArticle) => {
  return {
    title: article.title,
    content: article.content,
    author: article.author,
    image_url: article.image,
    reading_time: article.reading_time,
    tags: article.tags,
    summary: article.summary,
    region: article.region
  };
};

// Fetch all articles
export const fetchAllArticles = async (): Promise<CulturalArticle[]> => {
  try {
    const { data, error } = await supabase
      .from('cultural_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapArticleDtoToArticle);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

// Create a new article
export const createArticle = async (article: CulturalArticle): Promise<CulturalArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('cultural_articles')
      .insert(mapArticleToDto(article))
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapArticleDtoToArticle(data);
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

// Update an existing article
export const updateArticle = async (article: CulturalArticle): Promise<CulturalArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('cultural_articles')
      .update(mapArticleToDto(article))
      .eq('id', article.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapArticleDtoToArticle(data);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

// Delete an article
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cultural_articles')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

// Fetch an article by ID
export const fetchArticleById = async (id: string): Promise<CulturalArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('cultural_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return mapArticleDtoToArticle(data);
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    return null;
  }
};

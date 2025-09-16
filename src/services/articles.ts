
import { fetchArticles, fetchArticleById, fetchRelatedArticles } from './articles/articleQueries';
import { createArticle, updateArticle, deleteArticle } from './articles/articleMutations';

// Re-export Supabase article functions with the same API as the mock service
export { 
  fetchArticles as getCulturalArticles,
  fetchArticleById as getArticleById,
  fetchRelatedArticles as getRelatedArticles
};

// Export mutation functions for admin use
export { createArticle, updateArticle, deleteArticle };

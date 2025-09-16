
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Search, Trash2, Loader2, Eye } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllArticles, createArticle, updateArticle, deleteArticle } from '@/services/articles/articleService';
import { CulturalArticle } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AdminArticles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<CulturalArticle>>({});
  const [newArticle, setNewArticle] = useState<Partial<CulturalArticle>>({
    title: '',
    content: '',
    author: '',
    image: '',
    summary: '',
    region: '',
    tags: [],
    reading_time: 5
  });
  
  const queryClient = useQueryClient();

  // Fetch articles
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: fetchAllArticles
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      setIsAddDialogOpen(false);
      setNewArticle({
        title: '',
        content: '',
        author: '',
        image: '',
        summary: '',
        region: '',
        tags: [],
        reading_time: 5
      });
      toast.success('Article added successfully');
    },
    onError: (error) => {
      console.error('Error creating article:', error);
      toast.error('Failed to add article');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      setIsEditDialogOpen(false);
      toast.success('Article updated successfully');
    },
    onError: (error) => {
      console.error('Error updating article:', error);
      toast.error('Failed to update article');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  });

  // Filter articles based on search term
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.region || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddArticle = () => {
    if (!newArticle.title || !newArticle.content || !newArticle.author) {
      toast.error('Title, content, and author are required');
      return;
    }
    
    // Ensure tags is an array
    const articleToCreate = {
      ...newArticle,
      tags: newArticle.tags || []
    };
    
    createMutation.mutate(articleToCreate as CulturalArticle);
  };

  const handleEditArticle = () => {
    if (!currentArticle.title || !currentArticle.content || !currentArticle.author || !currentArticle.id) {
      toast.error('Title, content, and author are required');
      return;
    }
    
    // Ensure tags is an array
    const articleToUpdate = {
      ...currentArticle,
      tags: currentArticle.tags || []
    };
    
    updateMutation.mutate(articleToUpdate as CulturalArticle);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deleteMutation.mutate(id);
    }
  };

  const openPreviewDialog = (article: CulturalArticle) => {
    setCurrentArticle(article);
    setIsPreviewDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>, isNewArticle: boolean) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (isNewArticle) {
      setNewArticle({ ...newArticle, tags: tagsArray });
    } else {
      setCurrentArticle({ ...currentArticle, tags: tagsArray });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading articles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cultural Articles Management</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Article</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newArticle.title || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input 
                  id="author" 
                  value={newArticle.author || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea 
                  id="summary" 
                  value={newArticle.summary || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  value={newArticle.content || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input 
                    id="region" 
                    value={newArticle.region || ''}
                    onChange={(e) => setNewArticle({ ...newArticle, region: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reading_time">Reading Time (min)</Label>
                  <Input 
                    id="reading_time" 
                    type="number"
                    value={newArticle.reading_time || 5}
                    onChange={(e) => setNewArticle({ ...newArticle, reading_time: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  value={(newArticle.tags || []).join(', ')}
                  onChange={(e) => handleTagsChange(e, true)}
                  placeholder="asian, food, culture, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  value={newArticle.image || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                />
              </div>
              
              <Button 
                onClick={handleAddArticle} 
                className="w-full mt-2"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Saving...' : 'Save Article'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Input
          placeholder="Search articles..."
          className="pl-10 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No articles found
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>{article.region || 'Global'}</TableCell>
                  <TableCell>{formatDate(article.created_at)}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openPreviewDialog(article)}
                      title="Preview"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setCurrentArticle(article);
                        setIsEditDialogOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteArticle(article.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={currentArticle.title || ''}
                onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-author">Author</Label>
              <Input 
                id="edit-author" 
                value={currentArticle.author || ''}
                onChange={(e) => setCurrentArticle({ ...currentArticle, author: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-summary">Summary</Label>
              <Textarea 
                id="edit-summary" 
                value={currentArticle.summary || ''}
                onChange={(e) => setCurrentArticle({ ...currentArticle, summary: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea 
                id="edit-content" 
                value={currentArticle.content || ''}
                onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                className="min-h-[150px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-region">Region</Label>
                <Input 
                  id="edit-region" 
                  value={currentArticle.region || ''}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, region: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-reading_time">Reading Time (min)</Label>
                <Input 
                  id="edit-reading_time" 
                  type="number"
                  value={currentArticle.reading_time || 5}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, reading_time: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input 
                id="edit-tags" 
                value={(currentArticle.tags || []).join(', ')}
                onChange={(e) => handleTagsChange(e, false)}
                placeholder="asian, food, culture, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input 
                id="edit-image" 
                value={currentArticle.image || ''}
                onChange={(e) => setCurrentArticle({ ...currentArticle, image: e.target.value })}
              />
            </div>
            
            <Button 
              onClick={handleEditArticle} 
              className="w-full mt-2"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Article'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Article Preview: {currentArticle.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {currentArticle.image && (
              <div className="mb-4 w-full h-56 overflow-hidden rounded-lg">
                <img 
                  src={currentArticle.image} 
                  alt={currentArticle.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'placeholder.svg';
                  }}
                />
              </div>
            )}
            
            <h3 className="font-medium text-2xl mt-4">{currentArticle.title}</h3>
            
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <span className="mr-4">By {currentArticle.author}</span>
              {currentArticle.region && <span className="mr-4">Region: {currentArticle.region}</span>}
              <span>{currentArticle.reading_time} min read</span>
            </div>
            
            {currentArticle.summary && (
              <div className="mt-4 p-4 bg-gray-50 rounded italic">
                {currentArticle.summary}
              </div>
            )}
            
            <div className="mt-6 prose max-w-none">
              {currentArticle.content?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            {currentArticle.tags && currentArticle.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {currentArticle.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArticles;

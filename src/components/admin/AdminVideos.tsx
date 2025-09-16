import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Plus, Search, Trash2, Video, ExternalLink } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllVideos, createVideo, updateVideo, deleteVideo } from '@/services/supabaseVideos';
import { CookingVideo } from '@/types';
import { toast } from 'sonner';
import YouTubeEmbed from '@/components/YouTubeEmbed';

const videoTypes = ["Recipe", "Food Culture", "Category", "Item"] as const;

const AdminVideos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<CookingVideo>>({});
  const [newVideo, setNewVideo] = useState<Partial<CookingVideo>>({
    title: '',
    description: '',
    video_url: '',
    thumbnail: '',
    duration: 0,
    views: 0,
    chef: '',
    cuisine_type: '',
    video_type: 'Recipe',
  });
  
  const queryClient = useQueryClient();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: fetchAllVideos
  });

  const createMutation = useMutation({
    mutationFn: createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      setIsAddDialogOpen(false);
      setNewVideo({
        title: '',
        description: '',
        video_url: '',
        thumbnail: '',
        duration: 0,
        views: 0,
        chef: '',
        cuisine_type: '',
      });
      toast.success('Video added successfully');
    },
    onError: (error) => {
      console.error('Error creating video:', error);
      toast.error('Failed to add video');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      setIsEditDialogOpen(false);
      toast.success('Video updated successfully');
    },
    onError: (error) => {
      console.error('Error updating video:', error);
      toast.error('Failed to update video');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('Video deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  });

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.chef?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.video_url) {
      toast.error('Title and YouTube URL are required');
      return;
    }
    
    const videoToCreate = {
      ...newVideo,
      video_type: (newVideo.video_type || 'Recipe') as CookingVideo['video_type']
    };
    
    createMutation.mutate(videoToCreate as CookingVideo);
  };

  const handleEditVideo = () => {
    if (!currentVideo.title || !currentVideo.video_url || !currentVideo.id) {
      toast.error('Title and YouTube URL are required');
      return;
    }
    
    const videoToUpdate = {
      ...currentVideo,
      video_type: (currentVideo.video_type || 'Recipe') as CookingVideo['video_type']
    };
    
    updateMutation.mutate(videoToUpdate as CookingVideo);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      deleteMutation.mutate(id);
    }
  };

  const openPreviewDialog = (video: CookingVideo) => {
    setCurrentVideo(video);
    setIsPreviewDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Video Management</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newVideo.title || ''}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newVideo.description || ''}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video_url">YouTube URL</Label>
                <Input 
                  id="video_url" 
                  value={newVideo.video_url || ''}
                  onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input 
                  id="thumbnail" 
                  value={newVideo.thumbnail || ''}
                  onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video_type">Video Type</Label>
                <Select 
                  value={newVideo.video_type || 'Recipe'}
                  onValueChange={(value) => setNewVideo({ ...newVideo, video_type: value as CookingVideo['video_type'] })}
                >
                  <SelectTrigger id="video_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chef">Chef</Label>
                <Input 
                  id="chef" 
                  value={newVideo.chef || ''}
                  onChange={(e) => setNewVideo({ ...newVideo, chef: e.target.value })}
                />
              </div>
              
              <Button 
                onClick={handleAddVideo} 
                className="w-full mt-2"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Saving...' : 'Save Video'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Input
          placeholder="Search videos..."
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
              <TableHead>Type</TableHead>
              <TableHead>Chef</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No videos found
                </TableCell>
              </TableRow>
            ) : (
              filteredVideos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.video_type}</TableCell>
                  <TableCell>{video.chef || 'N/A'}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openPreviewDialog(video)}
                      title="Preview"
                    >
                      <Video size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setCurrentVideo(video);
                        setIsEditDialogOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteVideo(video.id)}
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
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={currentVideo.title || ''}
                onChange={(e) => setCurrentVideo({ ...currentVideo, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={currentVideo.description || ''}
                onChange={(e) => setCurrentVideo({ ...currentVideo, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-video_url">YouTube URL</Label>
              <Input 
                id="edit-video_url" 
                value={currentVideo.video_url || ''}
                onChange={(e) => setCurrentVideo({ ...currentVideo, video_url: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
              <Input 
                id="edit-thumbnail" 
                value={currentVideo.thumbnail || ''}
                onChange={(e) => setCurrentVideo({ ...currentVideo, thumbnail: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-video_type">Video Type</Label>
              <Select 
                value={currentVideo.video_type || 'Recipe'}
                onValueChange={(value) => setCurrentVideo({ ...currentVideo, video_type: value as CookingVideo['video_type'] })}
              >
                <SelectTrigger id="edit-video_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {videoTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-chef">Chef</Label>
              <Input 
                id="edit-chef" 
                value={currentVideo.chef || ''}
                onChange={(e) => setCurrentVideo({ ...currentVideo, chef: e.target.value })}
              />
            </div>
            
            <Button 
              onClick={handleEditVideo} 
              className="w-full mt-2"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Video'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Video Preview: {currentVideo.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {currentVideo.video_url && (
              <div className="mb-4">
                <YouTubeEmbed videoUrl={currentVideo.video_url} />
              </div>
            )}
            
            <h3 className="font-medium text-lg mt-4">{currentVideo.title}</h3>
            <p className="text-gray-600 mt-1">{currentVideo.description}</p>
            
            {currentVideo.chef && (
              <p className="text-sm text-gray-500 mt-2">Chef: {currentVideo.chef}</p>
            )}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <a href={currentVideo.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink size={16} />
                  Open on YouTube
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVideos;

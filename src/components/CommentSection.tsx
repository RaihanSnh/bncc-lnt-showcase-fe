import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment, User } from '@/pages/ProjectInterfaces';
import { toast } from 'sonner';

interface CommentSectionProps {
  projectId: string;
}

const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return undefined; // Return undefined if no URL, so AvatarImage won't render
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://localhost:8080/${url}`;
};

const CommentSection: React.FC<CommentSectionProps> = ({ projectId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/projects/${projectId}/comments`);
        if (!response.ok) {
          throw new Error('Failed to load comments.');
        }
        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        toast.error(err.message);
      }
    };

    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      setCurrentUser(JSON.parse(userJSON));
    }

    if (projectId) {
      fetchComments();
    }
  }, [projectId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) {
      toast.error('You must be logged in to comment.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication session has expired. Please log in again.');
      return;
    }

    setIsLoading(true);
    const promise = () => new Promise<Comment>(async (resolve, reject) => {
      const response = await fetch(`http://localhost:8080/user/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ comment_text: newComment }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to post comment.' }));
        reject(new Error(errorData.error || 'An unknown error occurred.'));
      } else {
        const addedComment = await response.json();
        
        // The user object for the new comment should be the currently logged-in user
        const newCommentWithUser: Comment = {
          ...addedComment,
          user: {
              ...currentUser,
              profile_image_url: currentUser.profile_image_url || undefined
          },
        };

        setComments(prev => [...prev, newCommentWithUser]);
        setNewComment('');
        resolve(newCommentWithUser);
      }
    });

    toast.promise(promise, {
      loading: 'Posting comment...',
      success: 'Comment posted successfully!',
      error: (err: Error) => err.message,
    });

    setIsLoading(false);
  };

  const getInitials = (username: string) => {
    return username?.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2) || 'A';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments</h3>
      
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!currentUser || isLoading}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!currentUser || isLoading || !newComment.trim()}>
            {isLoading ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
              <Avatar>
                <AvatarImage src={getFullImageUrl(comment.user.profile_image_url)} />
                <AvatarFallback>{getInitials(comment.user.username)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{comment.user.username}</p>
                    <p className="text-xs text-gray-500">{comment.user.region}</p>
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
                </div>
                <p className="mt-2 text-sm">{comment.comment_text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
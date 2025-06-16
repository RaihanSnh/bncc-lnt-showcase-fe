import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment, User } from '@/pages/ProjectInterfaces';
import { toast } from 'sonner';

interface CommentSectionProps {
  projectId: string;
}

// Mocked user data for logged in state
const mockUser: User = {
  id: "1",
  name: "Current User",
  email: "current@example.com",
  region: "KMG"
};

const CommentSection: React.FC<CommentSectionProps> = ({ projectId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch comments for the project
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/projects/${projectId}/comments`);
        if (!response.ok) {
          throw new Error('Failed to load comments.');
        }
        const data = await response.json();

        // Normalize the comment objects to match the Comment interface
        const normalized: Comment[] = (Array.isArray(data) ? data : []).map((c: any) => ({
          id: c.id,
          content: c.comment_text || c.content || '',
          user_id: c.user_id,
          project_id: c.project_id,
          createdAt: c.created_at || c.createdAt,
          user: {
            id: c.user?.id || c.user_id,
            username: c.user?.username || c.user?.name || 'Anonymous',
            email: c.user?.email || '',
            region: c.user?.region || '',
            role: c.user?.role || 'user'
          }
        }));
        setComments(normalized);
      } catch (err: any) {
        toast.error(err.message);
      }
    };

    // Get current user from localStorage
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
    if (!newComment.trim()) return;

    if (!currentUser) {
      toast.error('You must be logged in to comment.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication session has expired. Please log in again.');
      return;
    }

    setIsLoading(true);
    const promise = () => new Promise(async (resolve, reject) => {
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

        const newCommentWithUser: Comment = {
          id: addedComment.id,
          content: addedComment.comment_text,
          user_id: currentUser.id,
          project_id: projectId,
          createdAt: addedComment.created_at,
          user: {
            id: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            region: currentUser.region,
            role: currentUser.role,
          }
        };

        setComments(prev => [...prev, newCommentWithUser]);
        setNewComment('');
        resolve(newCommentWithUser);
      }
    });

    toast.promise(promise, {
      loading: 'Posting comment...',
      success: 'Comment posted successfully!',
      error: (err) => err.message,
    });

    setIsLoading(false);
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const parseToJakarta = (raw: string) => {
    let clean = raw;
    // Remove trailing Z or offset so Date treats as local
    clean = clean.replace(/Z$/, '').replace(/([+-]\d{2}:?\d{2})$/, '');
    return new Date(clean);
  };

  const formatDate = (dateString: string) => {
    const date = parseToJakarta(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta',
      hour12: false,
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments</h3>
      
      {/* Comment form */}
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
      
      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.user.username}`} />
                <AvatarFallback>{getInitials(comment.user.username)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{comment.user.username}</p>
                    <p className="text-xs text-gray-500">{comment.user.region}</p>
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                </div>
                <p className="mt-2 text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
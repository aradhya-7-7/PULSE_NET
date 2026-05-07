import { useState } from 'react';
import { Heart, MoreHorizontal, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../services/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { playBeep } from '../utils/audio';

interface PostProps {
  post: {
    id: string;
    userId: string;
    userEmail?: string;
    content: string;
    createdAt: string;
    likesCount: number;
  };
  currentUserEmail: string | null;
  onDelete: (id: string) => void;
}

export default function PostCard({ post, currentUserEmail, onDelete }: PostProps) {
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);

const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);
    
    playBeep(newLikedState ? 600 : 300, 'square', 0.1);

    try {
      await api.post(`/api/posts/${post.id}/like`);
    } catch (err) {
      setIsLiked(!newLikedState);
      setLikes(post.likesCount);
    }
  };

  const handleDelete = async () => {
    if (confirm("Delete this retro post?")) {
      // OPTIMISTIC DELETE: Remove from screen instantly
      onDelete(post.id);
      try {
        await api.delete(`/api/posts/${post.id}`);
      } catch (err) {
        alert("Failed to delete. Syncing network stream.");
        window.location.reload(); // Quick rollback if delete fails
      }
    }
  };

  const isOwner = currentUserEmail === post.userEmail;

  return (
    <div className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-5 rounded-none transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <img 
            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${post.userId}`} 
            alt="avatar" 
            className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          />
          <span className="font-mono text-xs sm:text-sm font-bold bg-retro-yellow px-2 py-1 border-2 border-black truncate max-w-[120px] sm:max-w-none">
            User_{post.userId.substring(0, 5)}
          </span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span className="text-[10px] sm:text-xs font-mono text-gray-600 font-bold uppercase">
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </span>
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 border-2 border-transparent hover:border-black transition-colors focus:outline-none">
                <MoreHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono min-w-[120px]">

                <DropdownMenuItem className="cursor-pointer hover:bg-retro-pink focus:bg-retro-pink text-black text-xs sm:text-sm py-2" onClick={handleDelete}>
                  <Trash2 size={14} className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <p className="text-base sm:text-lg font-sans text-black leading-relaxed mb-4 break-words">
        {post.content}
      </p>

      <div className="flex justify-between items-center border-t-4 border-black pt-3">
        <div className="flex gap-3">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 border-4 border-black transition-all active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold ${isLiked ? 'bg-retro-pink text-black' : 'bg-white hover:bg-gray-100'}`}
          >
            <Heart size={16} className="sm:w-[18px] sm:h-[18px]" fill={isLiked ? "black" : "none"} />
            <span className="font-mono text-sm sm:text-base">{likes}</span>
          </button>
        </div>

        <span className="font-mono text-[10px] sm:text-sm font-bold uppercase bg-retro-green px-2 py-1 border-2 border-black">
          🔥 Trending
        </span>
      </div>
    </div>
  );
}
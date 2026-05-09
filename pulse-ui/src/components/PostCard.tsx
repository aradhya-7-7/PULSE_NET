import { createContext, useContext, useState, type ReactNode } from "react";
import { Heart, MoreHorizontal, Trash2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import api from "../services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { playBeep } from "../utils/audio";
import { generateUsername } from "../utils/nameGenerator";

const AlertDialogContext = createContext<{ onOpenChange: (open: boolean) => void } | null>(null);

function AlertDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return open ? (
    <AlertDialogContext.Provider value={{ onOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        {children}
      </div>
    </AlertDialogContext.Provider>
  ) : null;
}

function AlertDialogContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function AlertDialogHeader({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function AlertDialogTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={className}>{children}</h2>;
}

function AlertDialogDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={className}>{children}</p>;
}

function AlertDialogFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function AlertDialogCancel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(AlertDialogContext);
  return (
    <button
      type="button"
      className={className}
      onClick={() => context?.onOpenChange(false)}
    >
      {children}
    </button>
  );
}

function AlertDialogAction({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const context = useContext(AlertDialogContext);
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        context?.onOpenChange(false);
      }}
    >
      {children}
    </button>
  );
}

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

export default function PostCard({
  post,
  currentUserEmail,
  onDelete,
}: PostProps) {
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  
  // Neo-Brutalist Dialog States
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));

    // Keeping your requested 200% volume boost (0.3)
    playBeep(newLikedState ? 600 : 300, "square", 0.3);

    try {
      await api.post(`/api/posts/${post.id}/like`);
    } catch (err) {
      setIsLiked(!newLikedState);
      setLikes(post.likesCount);
    }
  };

  const executeDelete = async () => {
    // OPTIMISTIC DELETE: Remove from screen instantly
    onDelete(post.id);
    
    try {
      await api.delete(`/api/posts/${post.id}`);
    } catch (err) {
      // If it fails, trigger the Neo-Brutalist Error Modal instead of alert()
      setShowErrorDialog(true);
    }
  };

  const isOwner = currentUserEmail === post.userEmail;

  const toggleComments = async () => {
    const willShow = !showComments;
    setShowComments(willShow);
    
    // Only fetch from the database if we are opening it and haven't loaded them yet
    if (willShow && comments.length === 0) {
      try {
        const res = await api.get(`/api/posts/${post.id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const res = await api.post(`/api/posts/${post.id}/comments`, { content: newComment });
      setComments([...comments, res.data]); // Append the new comment instantly
      setNewComment(""); // Clear the input box
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

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
            {generateUsername(post.userEmail || post.userId)}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span className="text-[10px] sm:text-xs font-mono text-gray-600 font-bold uppercase">
            {/* FORCE UTC PARSING WITH THE 'Z' APPEND */}
            {formatDistanceToNow(
              new Date(
                post.createdAt.endsWith("Z") || post.createdAt.includes("+")
                  ? post.createdAt
                  : `${post.createdAt}Z`,
              ),
            )}{" "}
            ago
          </span>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 border-2 border-transparent hover:border-black transition-colors focus:outline-none">
                <MoreHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono min-w-[120px]">
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-retro-pink focus:bg-retro-pink text-black text-xs sm:text-sm py-2"
                  onSelect={(e) => {
                    e.preventDefault(); // Prevents focus issues
                    setShowDeleteDialog(true); // Triggers the Neo-Brutalist Modal
                  }}
                >
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
            className={`flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 border-4 border-black transition-all active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold ${isLiked ? "bg-retro-pink text-black" : "bg-white hover:bg-gray-100"}`}
          >
            <Heart
              size={16}
              className="sm:w-[18px] sm:h-[18px]"
              fill={isLiked ? "black" : "none"}
            />
            <span className="font-mono text-sm sm:text-base">{likes}</span>
          </button>

          <button 
            onClick={toggleComments}
            className="flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 border-4 border-black transition-all active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold bg-white hover:bg-gray-100"
          >
            <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="font-mono text-sm sm:text-base">Reply</span>
          </button>
        </div>
      </div>

      {/* COMMENTS DRAWER */}
      {showComments && (
        <div className="mt-4 pt-4 border-t-4 border-black border-dashed">
          {/* Comment Input */}
          <form onSubmit={handlePostComment} className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Broadcast a reply..." 
              className="flex-1 border-4 border-black p-2 font-mono text-sm focus:outline-none focus:bg-retro-yellow/20"
            />
            <button type="submit" className="border-4 border-black px-4 py-2 bg-retro-pink font-bold font-mono hover:bg-retro-green transition-colors">
              SEND
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {comments.map((c) => (
              <div key={c.id} className="bg-gray-50 border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-retro-purple">
                    {/* Shows the Commenter's ID instead of the Post's ID */}
                    {c.userEmail ? c.userEmail.split('@')[0] : `User_${c.id.substring(0,5)}`}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {formatDistanceToNow(new Date(c.createdAt.endsWith('Z') ? c.createdAt : `${c.createdAt}Z`))} ago
                  </span>
                </div>
                <p className="text-sm font-sans text-black">{c.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center font-mono text-xs text-gray-500 py-2">No replies yet. Be the first.</p>
            )}
          </div>
        </div>
      )}

      {/* NEO-BRUTALIST DELETE CONFIRMATION */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white font-mono sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl uppercase text-black">
              System Override
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-base text-black font-bold">
              Are you sure you want to delete this transmission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 sm:space-x-4">
            <AlertDialogCancel className="border-4 border-black rounded-none bg-white hover:bg-gray-100 text-black uppercase font-bold px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none hover:translate-y-0 transition-all mt-2 sm:mt-0">
              Abort
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeDelete}
              className="border-4 border-black rounded-none bg-retro-pink hover:bg-red-500 text-black uppercase font-bold px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none hover:translate-y-0 transition-all"
            >
              Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* NEO-BRUTALIST ERROR DIALOG */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-retro-yellow font-mono sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl uppercase text-red-600 flex items-center gap-2">
              <span className="animate-pulse">⚠️</span> Sync Failure
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-base text-black font-bold">
              Failed to delete the transmission. The network matrix is out of sync. Re-establishing connection...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction 
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto border-4 border-black rounded-none bg-white hover:bg-gray-100 text-black uppercase font-bold px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none hover:translate-y-0 transition-all"
            >
              Reload Stream
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import { playBeep } from '../utils/audio';
import { toast } from 'sonner';

export default function TrendingFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  
  const [loading, setLoading] = useState(true); 
  const [loadingMore, setLoadingMore] = useState(false); 
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const navigate = useNavigate();

  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return; 
    if (observer.current) observer.current.disconnect(); 
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1); 
      }
    });
    
    if (node) observer.current.observe(node); 
  }, [loading, loadingMore, hasMore]);

  const fetchTrending = async (pageNumber: number) => {
    if (pageNumber === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await api.get('/api/posts/trending?page=${pageNumber}&size=10');
      
      setPosts(prevPosts => {
        if (pageNumber === 0) return response.data.content;
        return [...prevPosts, ...response.data.content];
      });

      setHasMore(!response.data.last); 
      
    } catch (error: any) {
      console.error("Failed to fetch feed", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login'); 
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTrending(page);
  }, [page]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    toast.warning("CONNECTION SEVERED.");
    navigate('/login');
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    playBeep(800, 'sawtooth', 0.15);

    try {
      await api.post('/api/posts', { content: newPost });
      setNewPost("");
      toast.success("TRANSMISSION BROADCASTED.");
      
      setPage(0);
      setHasMore(true);
      if (page === 0) {
          fetchTrending(0); 
      }
    } catch (error) {
      playBeep(150, 'square', 0.4);
      toast.error("TRANSMISSION FAILED: Network interference.");
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-6 sm:pt-10 px-4 flex flex-col items-center">
      
      {/* RESPONSIVE HEADER SECTION */}
      <div className="w-full max-w-2xl mb-8 flex flex-col items-center relative">
        <div className="w-full flex justify-between sm:justify-end gap-2 mb-6 sm:mb-0 sm:absolute sm:right-0 sm:top-0 z-10">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-full sm:w-auto bg-retro-yellow border-4 border-black px-3 py-2 sm:py-1 font-mono font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-xs"
          >
            My Profile
          </button>
          <button 
            onClick={handleLogout} 
            className="w-full sm:w-auto bg-white border-4 border-black px-3 py-2 sm:py-1 font-mono font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-retro-pink active:translate-y-1 active:shadow-none transition-all text-xs"
          >
            Disconnect
          </button>
        </div>

        <h1 className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tighter mb-2 mt-2 sm:mt-0 text-center" 
            style={{ textShadow: '4px 4px 0 #FF00FF, 6px 6px 0 #00E5FF' }}>
          PULSE_NET
        </h1>

      </div>

      <div className="w-full max-w-2xl flex flex-col gap-8">
        
        {/* POST CREATION FORM */}
        <form onSubmit={handlePostSubmit} className="bg-retro-blue border-4 border-black p-3 sm:p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
          <label className="font-mono font-bold text-black uppercase text-sm sm:text-base">Post a thought to the network:</label>
          <textarea 
            className="w-full border-4 border-black p-3 font-sans resize-none focus:outline-none focus:ring-4 focus:ring-retro-pink shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)] text-sm sm:text-base"
            rows={3}
            placeholder="What's happening?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-end">
            <button type="submit" className="w-full sm:w-auto bg-retro-yellow border-4 border-black px-6 py-2 sm:py-2 font-mono font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-1 active:shadow-none text-sm">
              Transmit [Enter]
            </button>
          </div>
        </form>

        {/* FEED LOOP */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {loading ? (
            <div className="text-center font-mono font-bold bg-black text-white p-4 border-4 border-white animate-pulse text-sm sm:text-base">
              INITIALIZING_DATA_STREAM...
            </div>
          ) : (
            posts.map((post, index) => {
              if (posts.length === index + 1) {
                return (
                  <div ref={lastPostElementRef} key={post.id}>
                    <PostCard 
                      post={post} 
                      currentUserEmail={localStorage.getItem('email')}
                      onDelete={(id) => setPosts(posts.filter(p => p.id !== id))}
                    />
                  </div>
                );
              } else {
                return (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUserEmail={localStorage.getItem('email')}
                    onDelete={(id) => setPosts(posts.filter(p => p.id !== id))}
                  />
                );
              }
            })
          )}
          
          {loadingMore && (
            <div className="text-center font-mono font-bold bg-retro-pink text-black p-4 border-4 border-black animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm sm:text-base">
              FETCHING_DEEPER_ARCHIVES...
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center font-mono font-bold text-gray-500 mt-2 sm:mt-4 border-t-4 border-black pt-4 text-sm sm:text-base">
              /// END OF NETWORK STREAM ///
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
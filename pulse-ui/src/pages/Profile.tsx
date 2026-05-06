import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';

export default function Profile() {
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentUserEmail = localStorage.getItem('email') || 'UNKNOWN_USER';

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await api.get('${API_URL}/api/posts/trending?page=0&size=50');
        const filteredPosts = response.data.content.filter(
          (post: any) => post.userEmail === currentUserEmail
        );
        setMyPosts(filteredPosts);
      } catch (error: any) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [currentUserEmail, navigate]);

  return (
    <div className="min-h-screen pb-20 pt-6 sm:pt-10 px-4 flex flex-col items-center">
      
      {/* Navigation Header */}
      <div className="w-full max-w-2xl mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        <button 
          onClick={() => navigate('/feed')} 
          className="w-full sm:w-auto bg-retro-yellow border-4 border-black px-4 py-2 font-mono font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all text-sm"
        >
          &lt; Back to Feed
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }} 
          className="w-full sm:w-auto bg-white border-4 border-black px-4 py-2 font-mono font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-retro-pink active:translate-y-1 active:shadow-none transition-all text-sm"
        >
          Disconnect
        </button>
      </div>

      {/* Identity Card */}
      <div className="w-full max-w-2xl bg-retro-blue border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 mb-8 sm:mb-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <img 
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentUserEmail}`} 
          alt="My Avatar" 
          className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        />
        <div className="flex flex-col text-center sm:text-left w-full">
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-black uppercase tracking-tight break-all">
            User Profile
          </h1>
          <p className="font-mono text-xs sm:text-sm font-bold bg-black text-retro-green inline-block px-2 sm:px-3 py-1 border-2 border-black mt-2 self-center sm:self-start break-all">
            ID: {currentUserEmail}
          </p>
          <p className="font-mono text-sm mt-3 font-bold">
            Status: <span className="text-green-700 animate-pulse">ONLINE</span>
          </p>
        </div>
      </div>

      {/* User's Post History */}
      <div className="w-full max-w-2xl flex flex-col gap-5 sm:gap-6">
        <h2 className="text-xl sm:text-2xl font-mono font-black border-b-4 border-black pb-2 mb-2" style={{ textShadow: '2px 2px 0 #FF00FF' }}>
          /// MY TRANSMISSIONS
        </h2>
        
        {loading ? (
          <div className="text-center font-mono font-bold bg-black text-white p-4 animate-pulse text-sm sm:text-base">
            LOADING_ARCHIVES...
          </div>
        ) : myPosts.length === 0 ? (
          <div className="bg-white border-4 border-black p-6 sm:p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-mono font-bold text-base sm:text-lg">No transmissions found.</p>
            <p className="font-mono text-xs sm:text-sm mt-2 text-gray-600">Go to the feed and post something!</p>
          </div>
        ) : (
          myPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUserEmail={currentUserEmail}
              onDelete={(id) => setMyPosts(myPosts.filter(p => p.id !== id))}
            />
          ))
        )}
      </div>
    </div>
  );
}